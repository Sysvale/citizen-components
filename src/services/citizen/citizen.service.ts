import type { CitizenServiceParams, CitizenResponse } from './citizen.types';
import { makeCitizens } from './citizen.factory';
import { getConfig, type CitizenComponentsConfig } from '../../config';
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
			return await this.apiCall(params);
		} catch (error) {
			throw this.handleErrors(error);
		}
	}

	private delay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	private async apiCall(params: CitizenServiceParams): Promise<CitizenResponse> {
		const endpoint = this.config.endpoints.index;

		const response = await axios.get(`${this.config.apiBaseUrl}${endpoint}`, {
			params,
		});

		return response.data;
	}

	private isCustomEndpointSet(endpoint: 'index') {
		return (
			this.config.apiBaseUrl &&
			this.config.endpoints &&
			this.config.endpoints[endpoint]
		);
	}

	private handleErrors(error: unknown): never {
		console.error('Error fetching citizens:', error);

		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		throw new Error(`Error fetching citizens: ${errorMessage}`);
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

	private citizensFilter(citizens: Citizen[], searchString: string) {
		return citizens.filter(
			citizen =>
				citizen.name.toLowerCase().includes(searchString.toLowerCase()) ||
				this.matchesMaskedField(searchString, citizen.cpf, removeCpfMask) ||
				this.matchesMaskedField(searchString, citizen.cns, removeCnsMask)
		);
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
