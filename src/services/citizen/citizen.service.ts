import type {
	CitizenServiceParams,
	CitizenResponse,
	CreateCitizenParams,
	CreateCitizenResponse,
	Citizen,
	ReadCitizenParams,
	ReadCitizenResponse,
	UpdateCitizenParams,
} from './citizen.types';
import { makeCitizen, makeCitizens } from './citizen.mock';
import { getConfig, type CitizenComponentsConfig, type Endpoints } from '../../config';
import { removeCpfMask, removeCnsMask } from '@sysvale/foundry';
import axios from 'axios';
import isCustomEndpointSet from '@/utils/isCustomEndpointSet';

export class CitizenService {
	private config: CitizenComponentsConfig;

	constructor() {
		this.config = getConfig();
	}

	async index(params: CitizenServiceParams): Promise<CitizenResponse> {
		if (!isCustomEndpointSet('index')) {
			await this.delay(1000);
			return this.indexMock(params);
		}

		try {
			const response = await this.apiCall('index', {
				params,
			});

			return response;
		} catch (error) {
			throw this.handleErrors(error);
		}
	}

	async create(data: CreateCitizenParams): Promise<CreateCitizenResponse> {
		if (!isCustomEndpointSet('create')) {
			await this.delay(1000);
			return this.citizenCreationMock(data);
		}

		try {
			const response = await this.apiCall('create', {
				data,
				method: 'post',
			});

			return response;
		} catch (error) {
			throw this.handleErrors(error);
		}
	}

	async read(params: ReadCitizenParams): Promise<ReadCitizenResponse> {
		if (!isCustomEndpointSet('index')) {
			await this.delay(1000);
			return this.showMock();
		}

		try {
			const response = await this.apiCall('index', {
				params,
			});

			return response;
		} catch (error) {
			throw this.handleErrors(error);
		}
	}

	async update(data: UpdateCitizenParams, document?: string): Promise<CreateCitizenResponse> {
		if (!isCustomEndpointSet('update')) {
			await this.delay(1000);
			return this.citizenUpdateMock(data);
		}

		const resolvedDocument = data.cns
			? data.cns
			: data.cpf;

		try {
			const response = await this.apiCall('update', {
				data,
				method: 'put',
				id: document ?? resolvedDocument,
			});

			return response;
		} catch (error) {
			throw this.handleErrors(error);
		}
	}

	private async apiCall<T = any>(
		endpointName: keyof Endpoints,
		options?: {
			method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
			params?: object;
			data?: object;
			id?: string;
		}
	): Promise<T> {
		const endpointUri = this.config.endpoints[endpointName];
		const url = options?.id
			? `${this.config.apiBaseUrl}${endpointUri}/${options.id}`
			: `${this.config.apiBaseUrl}${endpointUri}`;

		const axiosConfig: any = {
			url,
			method: options?.method ?? 'get',
			headers: {
				'Content-Type': 'application/json',
			},
			...(options?.params && { params: options.params }),
			...(options?.data && { data: options.data }),
		};

		const response = await axios.request<T>(axiosConfig);

		return response.data;
	}

	private handleErrors(error: unknown): never {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		throw new Error(`Erro: ${errorMessage}`);
	}

	private async indexMock(params: CitizenServiceParams): Promise<CitizenResponse> {
		let citizens = makeCitizens(150);

		if (params.search_string) {
			citizens = this.citizensFilter(citizens, params.search_string);
		}

		let paginatedCitizens = citizens.slice(
			(params.page - 1) * (params.per_page ?? 1),
			params.page * (params.per_page ?? 1)
		);

		if (params.fields && params.fields.length) {
			paginatedCitizens = paginatedCitizens.map(citizen => {
				return Object.fromEntries(
					Object.entries(citizen).filter(
						([key]) =>
							params.fields?.includes(key) || this.isKeyADefaultField(key)
					)
				) as Citizen;
			});
		}

		const response = {
			data: paginatedCitizens,
			meta: {
				current_page: params.page,
				per_page: params.per_page ?? 1,
				total: citizens.length,
				last_page: Math.ceil(citizens.length / (params.per_page ?? 1)),
			},
		};

		return response;
	}

	private async showMock(): Promise<ReadCitizenResponse> {
		return {
			data: [makeCitizen()],
		} as unknown as ReadCitizenResponse;
	}

	private async citizenCreationMock(
		params: CreateCitizenParams
	): Promise<CreateCitizenResponse> {
		let citizen = makeCitizens(1);

		const response = {
			data: {
				citizen: {
					...citizen[0],
					...params,
				},
			},
		};

		return response as CreateCitizenResponse;
	}

	private async citizenUpdateMock(
		params: UpdateCitizenParams
	): Promise<CreateCitizenResponse> {
		let citizen = makeCitizens(1);

		const response = {
			data: {
				citizen: {
					...citizen[0],
					...params,
				},
			},
		};

		return response as CreateCitizenResponse;
	}

	private citizensFilter(citizens: Citizen[], searchString: string) {
		return citizens.filter(
			citizen =>
				citizen.name.toLowerCase().includes(searchString.toLowerCase()) ||
				this.matchesMaskedField(searchString, citizen.cpf, removeCpfMask) ||
				this.matchesMaskedField(searchString, citizen.cns, removeCnsMask)
		);
	}

	private delay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private matchesMaskedField(
		searchString: string,
		field: string,
		maskRemover: (_: string) => string
	) {
		return (
			maskRemover(searchString).length &&
			maskRemover(field).includes(maskRemover(searchString))
		);
	}

	private isKeyADefaultField(key: string) {
		return key === 'name' || key === 'cpf' || key === 'cns';
	}
}
