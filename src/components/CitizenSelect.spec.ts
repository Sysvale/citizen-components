import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CitizenSelect from './CitizenSelect.vue';
import { CitizenService } from '../services/citizen/citizen.service';

vi.mock('../services/citizen/citizen.service');

const globalStubs = {
	CdsFlexbox: {
		template: '<div><slot /></div>',
	},
	CdsTextInput: {
		template:
			'<input v-model="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @keydown="$emit(\'keydown\', $event)" @blur="$emit(\'blur\', $event)" />',
		props: ['modelValue', 'state', 'fluid'],
		emits: ['update:modelValue', 'keydown', 'blur'],
	},
	CdsButton: {
		template:
			'<button @click="$emit(\'button-click\', $event)"><slot>{{ text }}</slot></button>',
		props: ['text', 'variant'],
		emits: ['button-click'],
	},
	CdsText: {
		template: '<span><slot /></span>',
		props: ['as', 'fontWeight', 'noMargin'],
	},
	SelectDropdown: {
		template:
			'<div v-if="options.length"><slot name="option" v-for="option in options" :option="option" /></div>',
		props: ['modelValue', 'options', 'fluid', 'optionsField'],
		emits: ['update:modelValue'],
	},
};

describe('CitizenSelect', () => {
	let mockSearch: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockSearch = vi.fn();
		CitizenService.prototype.search = mockSearch;
	});

	it('should render the component with text input', () => {
		const wrapper = mount(CitizenSelect, {
			props: {
				showButton: false,
			},
			global: {
				stubs: globalStubs,
			},
		});

		expect(wrapper.find('input').exists()).toBe(true);
	});

	it('should render button when showButton is true', () => {
		const wrapper = mount(CitizenSelect, {
			props: {
				showButton: true,
			},
			global: {
				stubs: globalStubs,
			},
		});

		const button = wrapper.find('button');
		expect(button.exists()).toBe(true);
		expect(button.text()).toContain('Buscar');
	});

	it('should not render button when showButton is false', () => {
		const wrapper = mount(CitizenSelect, {
			props: {
				showButton: false,
			},
			global: {
				stubs: globalStubs,
			},
		});

		expect(wrapper.find('button').exists()).toBe(false);
	});

	it('should call search when button is clicked', async () => {
		const mockCitizens = [
			{
				id: '1',
				name: 'João Silva',
				cpf: '123.456.789-00',
				cns: '123456789012345',
				birth_date: '1990-01-01',
			},
		];

		mockSearch.mockResolvedValue(mockCitizens);

		const wrapper = mount(CitizenSelect, {
			props: {
				showButton: true,
			},
			global: {
				stubs: globalStubs,
			},
		});

		wrapper.vm.searchString = 'João';
		await wrapper.vm.$nextTick();

		const button = wrapper.find('button');
		await button.trigger('click');

		expect(mockSearch).toHaveBeenCalledWith({
			searchString: 'João',
		});
	});

	it('should call search when Enter is pressed', async () => {
		const mockCitizens = [
			{
				id: '1',
				name: 'Maria Santos',
				cpf: '987.654.321-00',
				cns: '987654321098765',
				birth_date: '1985-05-15',
			},
		];

		mockSearch.mockResolvedValue(mockCitizens);

		const wrapper = mount(CitizenSelect, {
			props: {
				showButton: false,
			},
			global: {
				stubs: globalStubs,
			},
		});

		wrapper.vm.searchString = 'Maria';
		await wrapper.vm.$nextTick();

		const input = wrapper.find('input');
		await input.trigger('keydown.enter');

		expect(mockSearch).toHaveBeenCalledWith({
			searchString: 'Maria',
		});
	});

	it('should show dropdown with results after search', async () => {
		const mockCitizens = [
			{
				id: '1',
				name: 'João Silva',
				cpf: '123.456.789-00',
				cns: '123456789012345',
				birth_date: '1990-01-01',
			},
			{
				id: '2',
				name: 'Maria Santos',
				cpf: '987.654.321-00',
				cns: '987654321098765',
				birth_date: '1985-05-15',
			},
		];

		mockSearch.mockResolvedValue(mockCitizens);

		const wrapper = mount(CitizenSelect, {
			props: {
				showButton: true,
			},
			global: {
				stubs: globalStubs,
			},
		});

		wrapper.vm.searchString = 'Silva';
		await wrapper.vm.$nextTick();

		const button = wrapper.find('button');
		await button.trigger('click');

		await wrapper.vm.$nextTick();
		await wrapper.vm.$nextTick();

		expect(wrapper.vm.options).toEqual(mockCitizens);
		expect(wrapper.vm.isActive).toBe(true);
	});

	it('should update searchString when selecting a citizen object', async () => {
		const mockCitizen = {
			id: '1',
			name: 'João Silva',
			cpf: '123.456.789-00',
			cns: '123456789012345',
			birth_date: '1990-01-01',
		};

		const wrapper = mount(CitizenSelect, {
			props: {
				showButton: false,
				optionsField: 'name',
			},
			global: {
				stubs: globalStubs,
			},
		});

		wrapper.vm.val = mockCitizen as any;
		await wrapper.vm.$nextTick();

		expect(wrapper.vm.searchString).toBe('João Silva');
	});

	it('should emit updated modelValue when citizen is selected', async () => {
		const mockCitizen = {
			id: '1',
			name: 'João Silva',
			cpf: '123.456.789-00',
			cns: '123456789012345',
			birth_date: '1990-01-01',
		};

		const wrapper = mount(CitizenSelect, {
			props: {
				showButton: false,
			},
			global: {
				stubs: globalStubs,
			},
		});

		wrapper.vm.val = mockCitizen as any;
		await wrapper.vm.$nextTick();

		expect(wrapper.emitted('update:modelValue')).toBeTruthy();
		expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(
			mockCitizen
		);
	});

	it('should use custom optionsField when provided', async () => {
		const mockCitizen = {
			id: '1',
			name: 'João Silva',
			cpf: '123.456.789-00',
			cns: '123456789012345',
			birth_date: '1990-01-01',
		};

		const wrapper = mount(CitizenSelect, {
			props: {
				showButton: false,
				optionsField: 'cpf',
			},
			global: {
				stubs: globalStubs,
			},
		});

		wrapper.vm.val = mockCitizen as any;
		await wrapper.vm.$nextTick();

		expect(wrapper.vm.searchString).toBe('123.456.789-00');
	});
});
