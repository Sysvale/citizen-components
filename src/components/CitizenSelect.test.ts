import { describe, test, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CitizenSelect from './CitizenSelect.vue';
import { CitizenService } from '../services/citizen/citizen.service';

vi.mock('../services/citizen/citizen.service');

const globalStubs = {
	CdsFlexbox: true,
	CdsTextInput: true,
	CdsButton: true,
	CdsText: true,
	SelectDropdown: true,
};

describe('CitizenSelect', () => {
	let mockIndex: ReturnType<typeof vi.fn>;

	const mockResponse = {
		data: [
			{ id: '1', name: 'João Silva', cpf: '123.456.789-00' },
			{ id: '2', name: 'Maria Santos', cpf: '987.654.321-00' },
		],
		meta: { current_page: 1, per_page: 1000, total: 2, last_page: 1 },
	};

	beforeEach(() => {
		mockIndex = vi.fn().mockResolvedValue(mockResponse);
		CitizenService.prototype.index = mockIndex;
	});

	const createWrapper = (props?: Record<string, any>) =>
		mount(CitizenSelect, {
			props: { showButton: false, ...props },
			global: { stubs: globalStubs },
		});

	test('mounts successfully with required props', () => {
		const wrapper = createWrapper({ showButton: false });
		expect(wrapper.exists()).toBe(true);
	});

	test('mounts successfully when showButton is true', () => {
		const wrapper = createWrapper({ showButton: true });
		expect(wrapper.exists()).toBe(true);
	});

	test('accepts fluid prop', () => {
		const wrapper = createWrapper({ fluid: true });
		expect(wrapper.exists()).toBe(true);
	});

	test('accepts variant prop', () => {
		const wrapper = createWrapper({ showButton: true, variant: 'blue' });
		expect(wrapper.exists()).toBe(true);
	});

	test('accepts optionsField prop', () => {
		const wrapper = createWrapper({ optionsField: 'cpf' });
		expect(wrapper.exists()).toBe(true);
	});
});
