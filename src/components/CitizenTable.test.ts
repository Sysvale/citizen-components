import { describe, test, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CitizenTable from './CitizenTable.vue';
import { CitizenService } from '../services/citizen/citizen.service';

vi.mock('../services/citizen/citizen.service');

const globalStubs = {
	CdsDataTable: true,
	CdsPagination: true,
	CdsFlexbox: true,
	CdsText: true,
	CdsIconButton: true,
};

describe('CitizenTable', () => {
	let mockIndex: ReturnType<typeof vi.fn>;

	const mockResponse = {
		data: [
			{ id: '1', name: 'João Silva', birth_date: '1990-01-15' },
			{ id: '2', name: 'Maria Santos', birth_date: '1985-05-20' },
		],
		meta: {
			current_page: 1,
			per_page: 15,
			total: 45,
			last_page: 3,
		},
	};

	beforeEach(() => {
		mockIndex = vi.fn().mockResolvedValue(mockResponse);
		CitizenService.prototype.index = mockIndex;
	});

	const createWrapper = () =>
		mount(CitizenTable, { global: { stubs: globalStubs } });

	test('fetches citizens on mount with correct parameters', async () => {
		createWrapper();
		await vi.waitFor(() => expect(mockIndex).toHaveBeenCalled());

		expect(mockIndex).toHaveBeenCalledWith({
			page: 1,
			perPage: 15,
			fields: ['name', 'birth_date', 'address'],
			searchString: '',
		});
	});

	test('emits edit event', () => {
		const wrapper = createWrapper();
		wrapper.vm.$emit('edit');
		expect(wrapper.emitted('edit')).toBeTruthy();
	});

	test('emits details event', () => {
		const wrapper = createWrapper();
		wrapper.vm.$emit('details');
		expect(wrapper.emitted('details')).toBeTruthy();
	});

	test('handles fetch errors gracefully', async () => {
		const consoleErrorSpy = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {});
		mockIndex.mockRejectedValue(new Error('Network error'));

		createWrapper();
		await vi.waitFor(() => expect(consoleErrorSpy).toHaveBeenCalled());

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Error fetching citizens:',
			expect.any(Error)
		);

		consoleErrorSpy.mockRestore();
	});

	test('calls service again when mounted multiple times', async () => {
		createWrapper();
		await vi.waitFor(() => expect(mockIndex).toHaveBeenCalledTimes(1));

		createWrapper();
		await vi.waitFor(() => expect(mockIndex).toHaveBeenCalledTimes(2));

		expect(mockIndex).toHaveBeenCalledTimes(2);
	});
});
