import { getConfig, type CitizenComponentsConfig } from '@/config';
import isCustomEndpointSet from '@/utils/isCustomEndpointSet';
import axios from 'axios';
import { makeNeighborhoods, makeStreets } from './localities.mock';

const { apiBaseUrl, endpoints }: CitizenComponentsConfig = getConfig();

export const getNeighborhoodsByCityAndUf = (cityAndUf: {
	city: string;
	uf: string;
}): Promise<{ data: { id: string, name: string }[] }> => {
	if (!isCustomEndpointSet('neighborhoods')) {
		return new Promise(resolve =>
			setTimeout(() => {
				resolve({ data: makeNeighborhoods(10) });
			}, 2000)
		);
	}

	return axios.get(`${apiBaseUrl}${endpoints['neighborhoods']}`, { params: cityAndUf });
};

export const getStreetsFromNeighborhoods = (neighborhoodCityUfObject: {
	neighborhood_id: string;
	city: string;
	uf: string;
}): Promise<{ data: { name: string }[] }> => {
	if (!isCustomEndpointSet('streets')) {
		return new Promise(resolve =>
			setTimeout(() => {
				resolve({ data: makeStreets(10) });
			}, 2000)
		);
	}

	return axios.get(`${apiBaseUrl}${endpoints['streets']}`, { params: neighborhoodCityUfObject });
};
