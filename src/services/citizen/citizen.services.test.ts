import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import { CitizenService } from './citizen.service';
import { getConfig } from '../../config';
import axios from 'axios';
import { makeCitizens } from './citizen.factory';

vi.mock('../../config');
vi.mock('axios');
vi.mock('./citizen.factory');

describe('CitizenService', () => {
	let service: CitizenService;
	const mockApiConfig = getConfig as Mock;
	const mockAxiosRequest = axios.request as Mock;
	const mockMakeCitizens = makeCitizens as Mock;

	// Mock data simplificado
	const mockApiGetResponse = {
		data: [
			{ id: '1', name: 'João Silva', cpf: '12345678900' },
			{ id: '2', name: 'Maria Santos', cpf: '98765432100' },
		],
		meta: { current_page: 1, per_page: 10, total: 2, last_page: 1 },
	};

	const mockPostPayload = {
		name: 'José Victor',
		birth_date: '2002-12-27',
		cpf: '00000000000',
		cns: '000000000000000',
		gender: 'M',
	};

	const mockApiPostResponse = {
		citizen: { id: '1', name: 'João Silva', cpf: '12345678900' },
	};

	const mockCitizens = [
		{
			id: '1',
			name: 'João Silva',
			cpf: '12345678900',
			cns: '123456789012345',
		},
		{
			id: '2',
			name: 'Maria Silva',
			cpf: '98765432100',
			cns: '987654321098765',
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
		mockApiConfig.mockReturnValue({ apiBaseUrl: null, endpoints: null });
		service = new CitizenService();
	});

	describe('index - API mode', () => {
		beforeEach(() => {
			mockApiConfig.mockReturnValue({
				apiBaseUrl: 'https://api.example.com',
				endpoints: { index: '/citizens' },
			});
			service = new CitizenService();
			mockAxiosRequest.mockResolvedValue({ data: mockApiGetResponse });
		});

		test('calls API with correct parameters', async () => {
			const params = { page: 1, perPage: 10, searchString: 'João' };
			await service.index(params);

			expect(mockAxiosRequest).toHaveBeenCalledWith({
				url: 'https://api.example.com/citizens',
				method: 'get',
				params: params,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		});

		test('calls API with fields parameter', async () => {
			const params = {
				page: 1,
				perPage: 10,
				searchString: 'João',
				fields: ['name', 'cns', 'cpf'],
			};
			await service.index(params);

			expect(mockAxiosRequest).toHaveBeenCalledWith({
				url: 'https://api.example.com/citizens',
				method: 'get',
				params: params,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		});

		test('returns API response', async () => {
			const result = await service.index({ page: 1, perPage: 10 });
			expect(result).toEqual(mockApiGetResponse);
		});

		test('throws error when API call fails', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			mockAxiosRequest.mockRejectedValue(new Error('Network error'));

			await expect(service.index({ page: 1, perPage: 10 })).rejects.toThrow(
				'Error calling citizens API: Network error'
			);
			consoleErrorSpy.mockRestore();
		});
	});

	describe('index - Mock mode', () => {
		beforeEach(() => {
			mockMakeCitizens.mockReturnValue(mockCitizens);
		});

		test('uses mock when apiBaseUrl is not configured', async () => {
			const result = await service.index({ page: 1, perPage: 10 });

			expect(mockAxiosRequest).not.toHaveBeenCalled();
			expect(mockMakeCitizens).toHaveBeenCalledWith(150);
			expect(result.data).toEqual(mockCitizens);
		});

		test('returns paginated results', async () => {
			const largeMockData = Array.from({ length: 50 }, (_, i) => ({
				id: `${i + 1}`,
				name: `Citizen ${i + 1}`,
			}));
			mockMakeCitizens.mockReturnValue(largeMockData);

			const result = await service.index({ page: 1, perPage: 10 });

			expect(result.data).toHaveLength(10);
			expect(result.meta).toEqual({
				current_page: 1,
				per_page: 10,
				total: 50,
				last_page: 5,
			});
		});

		test('filters by name (case insensitive)', async () => {
			const result = await service.index({
				page: 1,
				perPage: 10,
				searchString: 'silva',
			});

			expect(result.data).toHaveLength(2);
			expect(result.data.every(c => c.name.toLowerCase().includes('silva'))).toBe(
				true
			);
		});

		test('filters by CPF', async () => {
			const result = await service.index({
				page: 1,
				perPage: 10,
				searchString: '12345678900',
			});

			expect(result.data).toHaveLength(1);
			expect(result.data[0]?.cpf).toBe('12345678900');
		});

		test('returns empty array when no match', async () => {
			const result = await service.index({
				page: 1,
				perPage: 10,
				searchString: 'xyz-not-found',
			});

			expect(result.data).toEqual([]);
			expect(result.meta.total).toBe(0);
		});
	});

	describe('create - API mode', () => {
		beforeEach(() => {
			mockApiConfig.mockReturnValue({
				apiBaseUrl: 'https://api.example.com',
				endpoints: { create: '/citizens' },
			});
			service = new CitizenService();
			mockAxiosRequest.mockResolvedValue({ data: mockApiPostResponse });
		});

		test('calls API with correct payload', async () => {
			await service.create(mockPostPayload);

			expect(mockAxiosRequest).toHaveBeenCalledWith({
				url: 'https://api.example.com/citizens',
				method: 'post',
				data: mockPostPayload,
				headers: {
					'Content-Type': 'application/json',
				},
			});
		});

		test('returns API response', async () => {
			const result = await service.create(mockPostPayload);
			expect(result).toEqual(mockApiPostResponse);
		});

		test('throws error when API call fails', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			mockAxiosRequest.mockRejectedValue(new Error('Network error'));

			await expect(service.create(mockPostPayload)).rejects.toThrow(
				'Error calling citizens API: Network error'
			);
			consoleErrorSpy.mockRestore();
		});
	});

	describe('create - Mock mode', () => {
		beforeEach(() => {
			mockMakeCitizens.mockReturnValue(mockCitizens[0]);
		});

		test('uses mock when apiBaseUrl is not configured', async () => {
			const result = await service.create(mockPostPayload);

			expect(mockAxiosRequest).not.toHaveBeenCalled();
			expect(mockMakeCitizens).toHaveBeenCalledWith(1);
			expect(result.data).toEqual({ citizen: mockPostPayload });
		});
	});
});
