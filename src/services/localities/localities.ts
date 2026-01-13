import { getConfig, type CitizenComponentsConfig } from '@/config';
import { makeNeighborhoods, makeStreets } from './localities.mock';

const { apiBaseUrl }: CitizenComponentsConfig = getConfig();

export const getNeighborhoodsByCityAndUf = (cityAndUf: {
	city: string;
	uf: string;
}): Promise<{ data: { name: string }[] }> => {
	return new Promise(resolve =>
		setTimeout(() => {
			resolve({ data: makeNeighborhoods(10) });
		}, 2000)
	);
	// return axios.get(`${apiBaseUrl}/neighborhoods`, { data: cityAndUf });
};

export const getStreetsFromNeighborhoods = (neighborhoodCityUfObject: {
	neighborhood: string;
	city: string;
	uf: string;
}): Promise<{ data: { name: string }[] }> => {
	return new Promise(resolve =>
		setTimeout(() => {
			resolve({ data: makeStreets(10) });
		}, 2000)
	);
	// return axios.get(`${apiBaseUrl}/streets`, { data: cityAndUf });
};
