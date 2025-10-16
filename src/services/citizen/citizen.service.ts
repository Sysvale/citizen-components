import type { Citizen } from './citizen.types';
import { makeCitizens } from './citizen.factory';
import { getConfig } from '../../config';
import axios from 'axios';

export class CitizenService {
	async search(params: { searchString: string }): Promise<Citizen[]> {
		const config = getConfig();

		if (
			!config.apiBaseUrl ||
			!config.endpoints ||
			!config.endpoints.search
		) {
			return this.searchMock(params.searchString);
		}

		try {
			const endpoint = config.endpoints.search || '/citizens';
			const response = await axios.get(
				`${config.apiBaseUrl}${endpoint}`,
				{ params }
			);

			const citizens = response.data.data ?? response.data;
			return citizens;
		} catch (error) {
			console.error('Error fetching citizens:', error);

			const errorMessage =
				error instanceof Error
					? error.message
					: 'Unknown error';
			throw new Error(`Error fetching citizens: ${errorMessage}`);
		}
	}

	private async searchMock(searchString: string): Promise<Citizen[]> {
		const citizens = await new Promise<Citizen[]>(resolve => {
			setTimeout(() => {
				resolve(makeCitizens(150));
			}, 1000);
		});

		if (!searchString) return [];

		return citizens.filter(citizen =>
			citizen.name
				.toLowerCase()
				.includes(searchString.toLowerCase())
		);
	}
}
