import axios from 'axios';
import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest';
import { nextTick } from 'vue';
import { getConfig } from '../../config';
import { makeNeighborhoods, makeStreets } from './localities.mock';
import {
	getNeighborhoodsByCityAndUf,
	getStreetsFromNeighborhoods,
} from './localities.service';
vi.mock('../../config', () => ({
	getConfig: vi.fn(() => ({
		apiBaseUrl: 'https://api.example.com',
		endpoints: {
			neighborhoods: '/citizens/neighborhoods',
			streets: '/citizens/streets',
		},
	})),
}));

vi.mock('axios');
vi.mock('./localities.mock');

describe('LocalitiesService', () => {
	let getNeighborhoodsService: typeof getNeighborhoodsByCityAndUf;
	let getStreetsService: typeof getStreetsFromNeighborhoods;
	const mockApiConfig = getConfig as Mock;
	const mockAxiosGetRequest = axios.get as Mock;
	const mockMakeNeighborhoods = makeNeighborhoods as Mock;
	const mockMakeStreets = makeStreets as Mock;

	const mockApiGetNeighborhoodsResponse = {
		data: [
			{ id: '1', name: 'João Silva', cpf: '12345678900' },
			{ id: '2', name: 'Maria Santos', cpf: '98765432100' },
		],
	};

	const mockApiGetStreetsResponse = {
		data: [
			{ id: '1', name: 'João Silva', cpf: '12345678900' },
			{ id: '2', name: 'Maria Santos', cpf: '98765432100' },
		],
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockApiConfig.mockReturnValue({ apiBaseUrl: null, endpoints: null });
		getNeighborhoodsService = getNeighborhoodsByCityAndUf;
		getStreetsService = getStreetsFromNeighborhoods;
	});

	describe('Get Neighborhoods - Mock mode', () => {
		beforeEach(() => {
			mockMakeNeighborhoods.mockReturnValue(mockApiGetNeighborhoodsResponse);
		});

		test('uses mock when endpoint is not setted up', async () => {
			vi.useFakeTimers();
			const data = { city: 'Jacobina', uf: 'BA' };
			const promise = getNeighborhoodsByCityAndUf(data);

			await nextTick();
			vi.runAllTimers();

			const result = await promise;

			expect(mockAxiosGetRequest).not.toHaveBeenCalled();
			expect(mockMakeNeighborhoods).toHaveBeenCalledWith(10);
			expect(result.data).toEqual(mockApiGetNeighborhoodsResponse);
			vi.useRealTimers();
		});
	});

	describe('Get Neighborhoods - API mode', () => {
		beforeEach(() => {
			mockApiConfig.mockReturnValue({
				apiBaseUrl: 'https://api.example.com',
				endpoints: { neighborhoods: '/citizens/neighborhoods' },
			});
			mockAxiosGetRequest.mockResolvedValue(mockApiGetNeighborhoodsResponse);
		});

		test('calls API with correct data', async () => {
			const params = { city: 'Jacobina', uf: 'BA' };
			await getNeighborhoodsService(params);

			expect(mockAxiosGetRequest).toHaveBeenCalledWith(
				'https://api.example.com/citizens/neighborhoods',
				{
					params,
				}
			);
		});

		test('returns API response', async () => {
			const result = await mockAxiosGetRequest();
			expect(result).toEqual(mockApiGetNeighborhoodsResponse);
		});

		test('throws error when API call fails', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			mockAxiosGetRequest.mockRejectedValue(new Error('Network error'));

			await expect(mockAxiosGetRequest()).rejects.toThrow('Network error');
			consoleErrorSpy.mockRestore();
		});
	});

	describe('Get Streets - Mock mode', () => {
		beforeEach(() => {
			mockMakeStreets.mockReturnValue(mockApiGetStreetsResponse);
		});

		test('uses mock when endpoint is not setted up', async () => {
			vi.useFakeTimers();
			const params = {
				neighborhood_name: 'Caixa da Laranjeira',
				city: 'Jacobina',
				uf: 'BA',
			};
			const promise = getStreetsFromNeighborhoods(params);

			await nextTick();
			vi.runAllTimers();

			const result = await promise;

			expect(mockAxiosGetRequest).not.toHaveBeenCalled();
			expect(mockMakeStreets).toHaveBeenCalledWith(10);
			expect(result.data).toEqual(mockApiGetStreetsResponse);
			vi.useRealTimers();
		});
	});

	describe('Get Streets - API mode', () => {
		beforeEach(() => {
			mockApiConfig.mockReturnValue({
				apiBaseUrl: 'https://api.example.com',
				endpoints: { streets: '/citizens/streets' },
			});
			mockAxiosGetRequest.mockResolvedValue(mockApiGetStreetsResponse);
		});

		test('calls API with correct data', async () => {
			const params = {
				neighborhood_name: 'Caixa da Laranjeira',
				city: 'Jacobina',
				uf: 'BA',
			};
			await getStreetsService(params);

			expect(mockAxiosGetRequest).toHaveBeenCalledWith(
				'https://api.example.com/citizens/streets',
				{
					params,
				}
			);
		});

		test('returns API response', async () => {
			const result = await mockAxiosGetRequest();
			expect(result).toEqual(mockApiGetStreetsResponse);
		});

		test('throws error when API call fails', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			mockAxiosGetRequest.mockRejectedValue(new Error('Network error'));

			await expect(mockAxiosGetRequest()).rejects.toThrow('Network error');
			consoleErrorSpy.mockRestore();
		});
	});
});
