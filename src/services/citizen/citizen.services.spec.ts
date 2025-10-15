import {
	describe,
	it,
	expect,
	vi,
	beforeEach,
	type Mock,
} from 'vitest';
import { CitizenService } from './citizen.service';
import { getConfig } from '../../config';
import axios from 'axios';
import { makeCitizens } from './citizen.factory';

vi.mock('../../config');
vi.mock('axios');
vi.mock('./citizen.factory');

describe('CitizenService', () => {
	let service: CitizenService;
	const mockGetConfig = getConfig as Mock;
	const mockAxiosGet = axios.get as Mock;
	const mockMakeCitizens = makeCitizens as Mock;

	beforeEach(() => {
		service = new CitizenService();
		vi.clearAllMocks();
	});

	describe('search', () => {
		it('should call API when config is properly set', async () => {
			const mockCitizens = [
				{
					id: '1',
					name: 'João Silva',
					cpf: '123.456.789-00',
					cns: '123456789012345',
				},
			];

			mockGetConfig.mockReturnValue({
				apiBaseUrl: 'https://api.example.com',
				endpoints: {
					search: '/api/citizens',
				},
			});

			mockAxiosGet.mockResolvedValue({
				data: mockCitizens,
			});

			const result = await service.search({
				searchString: 'João',
			});

			expect(mockAxiosGet).toHaveBeenCalledWith(
				'https://api.example.com/api/citizens',
				{
					params: { searchString: 'João' },
				}
			);

			expect(result).toEqual(mockCitizens);
		});

		it('should use mock when apiBaseUrl is not configured', async () => {
			const mockCitizens = [
				{
					id: '1',
					name: 'Pedro Oliveira',
					cpf: '111.222.333-44',
					cns: '111222333445566',
				},
			];

			mockGetConfig.mockReturnValue({
				apiBaseUrl: null,
				endpoints: null,
			});

			mockMakeCitizens.mockReturnValue(mockCitizens);

			const result = await service.search({
				searchString: 'Pedro',
			});

			expect(mockAxiosGet).not.toHaveBeenCalled();
			expect(mockMakeCitizens).toHaveBeenCalledWith(150);
			expect(result).toEqual(mockCitizens);
		});

		it('should use mock when endpoints are not configured', async () => {
			const mockCitizens = [
				{
					id: '1',
					name: 'Ana Costa',
					cpf: '555.666.777-88',
					cns: '555666777889900',
				},
			];

			mockGetConfig.mockReturnValue({
				apiBaseUrl: 'https://api.example.com',
				endpoints: null,
			});

			mockMakeCitizens.mockReturnValue(mockCitizens);

			const result = await service.search({
				searchString: 'Ana',
			});

			expect(mockAxiosGet).not.toHaveBeenCalled();
			expect(result).toEqual(mockCitizens);
		});

		it('should throw error with details when API call fails', async () => {
			mockGetConfig.mockReturnValue({
				apiBaseUrl: 'https://api.example.com',
				endpoints: {
					search: '/api/citizens',
				},
			});

			mockAxiosGet.mockRejectedValue(new Error('Network error'));

			await expect(
				service.search({ searchString: 'João' })
			).rejects.toThrow('Error fetching citizens: Network error');
		});

		it('should handle non-Error exceptions', async () => {
			mockGetConfig.mockReturnValue({
				apiBaseUrl: 'https://api.example.com',
				endpoints: {
					search: '/api/citizens',
				},
			});

			mockAxiosGet.mockRejectedValue('String error');

			await expect(
				service.search({ searchString: 'João' })
			).rejects.toThrow('Error fetching citizens: Unknown error');
		});
	});

	describe('searchMock', () => {
		beforeEach(() => {
			mockGetConfig.mockReturnValue({
				apiBaseUrl: null,
				endpoints: null,
			});
		});

		it('should return empty array when search string is empty', async () => {
			mockMakeCitizens.mockReturnValue([
				{
					id: '1',
					name: 'João Silva',
					cpf: '123.456.789-00',
					cns: '123456789012345',
				},
			]);

			const result = await service.search({ searchString: '' });

			expect(result).toEqual([]);
		});

		it('should filter citizens by name (case insensitive)', async () => {
			mockMakeCitizens.mockReturnValue([
				{
					id: '1',
					name: 'João Silva',
					cpf: '123.456.789-00',
					cns: '123456789012345',
				},
				{
					id: '2',
					name: 'Maria Silva',
					cpf: '987.654.321-00',
					cns: '987654321098765',
				},
				{
					id: '3',
					name: 'Pedro Santos',
					cpf: '111.222.333-44',
					cns: '111222333445566',
				},
			]);

			const result = await service.search({
				searchString: 'silva',
			});

			expect(result).toHaveLength(2);
			expect(result[0].name).toBe('João Silva');
			expect(result[1].name).toBe('Maria Silva');
		});

		it('should filter citizens by partial name match', async () => {
			mockMakeCitizens.mockReturnValue([
				{
					id: '1',
					name: 'João Silva',
					cpf: '123.456.789-00',
					cns: '123456789012345',
				},
				{
					id: '2',
					name: 'Maria Silva',
					cpf: '987.654.321-00',
					cns: '987654321098765',
				},
				{
					id: '3',
					name: 'Pedro Santos',
					cpf: '111.222.333-44',
					cns: '111222333445566',
				},
			]);

			const result = await service.search({ searchString: 'Jo' });

			expect(result).toHaveLength(1);
			expect(result[0].name).toBe('João Silva');
		});

		it('should return empty array when no citizens match', async () => {
			mockMakeCitizens.mockReturnValue([
				{
					id: '1',
					name: 'João Silva',
					cpf: '123.456.789-00',
					cns: '123456789012345',
				},
			]);

			const result = await service.search({
				searchString: 'xyz',
			});

			expect(result).toEqual([]);
		});
	});
});
