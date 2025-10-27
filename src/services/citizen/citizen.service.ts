import type {
	CitizenServiceParams,
	CitizenResponse,
	CreateCitizenParams,
	CreateCitizenResponse,
} from './citizen.types';
import { makeCitizens } from './citizen.factory';
import { getConfig, type CitizenComponentsConfig, type Endpoints } from '../../config';
import { removeCpfMask, removeCnsMask } from '@sysvale/foundry';
import axios from 'axios';

export class CitizenService {
	private config: CitizenComponentsConfig;

	constructor() {
		this.config = getConfig();
	}

	async index(params: CitizenServiceParams): Promise<CitizenResponse> {
		if (!this.isCustomEndpointSet('index')) {
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
		if (!this.isCustomEndpointSet('create')) {
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

	private async apiCall<T = any>(
		endpointName: keyof Endpoints,
		options?: {
			method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
			params?: object;
			data?: object;
		}
	): Promise<T> {
		const endpointUri = this.config.endpoints[endpointName];
		const url = `${this.config.apiBaseUrl}${endpointUri}`;

		const axiosConfig: any = {
			url,
			method: options?.method ?? 'get',
			headers: {
				'Content-Type': 'application/json',
			},
			...(options?.params && { params: options.params }),
			...(options?.data && { data: options.data }),
		};

		try {
			const response = await axios.request<T>(axiosConfig);

			return response.data;
		} catch (error) {
			throw this.handleErrors(error);
		}
	}

	private isCustomEndpointSet(endpoint: keyof Endpoints) {
		return (
			this.config.apiBaseUrl &&
			this.config.endpoints &&
			this.config.endpoints[endpoint]
		);
	}

	private handleErrors(error: unknown): never {
		console.error('Error calling citizens API:', error);

		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		throw new Error(`Error calling citizens API: ${errorMessage}`);
	}

	private async indexMock(params: CitizenServiceParams): Promise<CitizenResponse> {
		let citizens = makeCitizens(150);

		if (params.searchString) {
			citizens = this.citizensFilter(citizens, params.searchString);
		}

		let paginatedCitizens = citizens.slice(
			(params.page - 1) * (params.perPage ?? 1),
			params.page * (params.perPage ?? 1)
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
				per_page: params.perPage ?? 1,
				total: citizens.length,
				last_page: Math.ceil(citizens.length / (params.perPage ?? 1)),
			},
		};

		return response;
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
