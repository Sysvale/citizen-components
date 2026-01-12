import { getConfig, type CitizenComponentsConfig } from '@/config';
import { makeNeighborhoods } from './localities.mock';

const { apiBaseUrl }: CitizenComponentsConfig = getConfig();

export const getNeighborhoodsByCityAndUf = (cityAndUf: {
	city: string;
	uf: string;
}): Promise<{ data: { name: string }[] }> => {
	console.log('🚀 ~ getNeighborhoodsByCityAndUf ~ cityAndUf:', cityAndUf);
	return new Promise(resolve =>
		setTimeout(() => {
			resolve({ data: makeNeighborhoods(10) });
		}, 5000)
	);
	// return axios.get(`${apiBaseUrl}/neighborhoods`, { data: cityAndUf });
};
