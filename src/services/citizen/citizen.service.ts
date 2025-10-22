import type {
	CitizenServiceParams,
	CitizenResponse,
	CreateCitizenParams,
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

		const endpointUri = this.config.endpoints['index'];

		try {
			const response = await axios.get(`${this.config.apiBaseUrl}${endpointUri}`, {
				params,
			});

			return response.data;
		} catch (error) {
			throw this.handleErrors(error);
		}
	}

	async create(params: CreateCitizenParams): Promise<Citizen> {
		if (!this.isCustomEndpointSet('create')) {
			await this.delay(1000);
			return this.createCitizenMock(params);
		}

		const endpointUri = this.config.endpoints['create'];

		try {
			const response = await axios.post(`${this.config.apiBaseUrl}${endpointUri}`, {
				params,
			});

			return response.data;
		} catch (error) {
			throw this.handleErrors(error);
		}
	}

	private delay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	// private async apiCall(params: object, endpointName: keyof Endpoints): Promise<any> {
	// 	const endpointUri = this.config.endpoints[endpointName];

	// 	const response = await axios.get(`${this.config.apiBaseUrl}${endpointUri}`, {
	// 		params,
	// 	});

	// 	return response.data;
	// }

	private isCustomEndpointSet(endpoint: keyof Endpoints) {
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

	private async createCitizenMock(params: CreateCitizenParams): Promise<Citizen> {
		return {
			citizen: {
				...params,
				race: 'string',
				co_cidadao: 1,
				is_dead: false,
				mother_name: 'a',
			},
		} as unknown as Citizen;

		// 		{
		//   "citizen": {
		//     "id": "38e32884-b163-3cdc-b1c8-8aa9d6fbaabe",
		//     "name": "Yvette Mann",
		//     "birth_date": "2012-12-02",
		//     "cpf": "123456789",
		//     "cns": "126580418345227",
		//     "identification_document": "1322936",
		//     "issuing_agency": "Reinger, Waelchi and Dach",
		//     "gender": "F",
		//     "race": "black",
		//     "phone": "7148249248",
		//     "cellphone": "4196183000",
		//     "email": "yvette@auer.com",
		//     "mother_name": "Abbigail Wehner",
		//     "cpf_responsible": "98408966372",
		//     "is_dead": false,
		//     "pregnant": false,
		//     "co_cidadao": 2503,
		//     "address": {
		//       "cep": "17516354",
		//       "street": "Joyce Villages",
		//       "number": "42",
		//       "complement": "Sit ab qui qui nostrum beatae eum. Ullam sit ipsam velit animi. Unde ea quibusdam sit porro.",
		//       "neighborhood": "voluptate",
		//       "city": "East Cindymouth",
		//       "uf": "IN"
		//     }
		//   }
		// }
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
