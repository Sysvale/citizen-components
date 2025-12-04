import CitizenForm from './CitizenForm.vue';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import '../../utils/rules/citizenFormRules';
import citizenFormFields from '@/constants/citizenFormFields';
import { makeCitizen } from '@/services/citizen/citizen.factory';
// @ts-ignore
import Cuida from '@sysvale/cuida';

const mockToastFire = vi.fn();
const mockToast = vi.fn(() => ({ fire: mockToastFire }));

describe('CitizenForm', () => {
	let wrapper: VueWrapper<any>;

	beforeEach(() => {
		wrapper = mount(CitizenForm, {
			global: {
				plugins: [Cuida],
				stubs: {
					CdsTextInput: true,
					CdsSelect: true,
					CdsCheckbox: true,
					CdsDateInput: true,
				},
				provide: {
					useToast: mockToast,
				},
			},
		});
	});

	afterEach(() => {
		wrapper.unmount();
	});

	test('is rendered correctly', () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	test('pregnant checkbox is enabled when gender is female', async () => {
		const formRefInstance = wrapper.vm.formRef;

		const pregnantCheckbox = wrapper.find('[data-testid="test-pregnant"]');

		expect(pregnantCheckbox.attributes().disabled).toBe('true');
		
		await formRefInstance.setFieldValue('gender', { value: 'F'});

		expect(pregnantCheckbox.attributes().disabled).toBe('false');
	});

	test('all fields are disabled correctly by different props', async () => {
		await wrapper.setProps({
			disabled: true,
		});

		citizenFormFields([]).forEach(({ name }) => {
			expect(wrapper.find(`[data-testid="test-${name}"]`).attributes().disabled).toBe('true');
		});

		await wrapper.setProps({
			disabled: false,
		});

		citizenFormFields([]).forEach(({ name }) => {
			if (['pregnant', 'city'].includes(name)) {
				expect(wrapper.find(`[data-testid="test-${name}"]`).attributes().disabled).toBe('true');
				return;
			}

			expect(wrapper.find(`[data-testid="test-${name}"]`).attributes().disabled).toBe('false');
		});

		await wrapper.setProps({
			disabled: false,
			disabledFields: 'all',
		});

		citizenFormFields([]).forEach(({ name }) => {
			expect(wrapper.find(`[data-testid="test-${name}"]`).attributes().disabled).toBe('true');
		});
	});

	test('fields are disabled correctly', async () => {
		await wrapper.setProps({
			disabledFields: ['name', 'cpf'],
		});

		expect(wrapper.find('[data-testid="test-name"]').attributes().disabled).toBe('true');
		expect(wrapper.find('[data-testid="test-cpf"]').attributes().disabled).toBe('true');
	});

	test('fields are hidden correctly', async () => {
		await wrapper.setProps({
			hiddenFields: ['name', 'cpf'],
		});

		expect(wrapper.find('[data-testid="test-name"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="test-cpf"]').exists()).toBe(false);
	});

	test('if form is filled with initial data', async () => {
		await wrapper.unmount();

		const citizenInfo = makeCitizen();

		wrapper = await mount(CitizenForm, {
			props: {
				initialData: citizenInfo,
			},
			global: {
				plugins: [Cuida],
				stubs: {
					CdsTextInput: true,
					CdsSelect: true,
					CdsCheckbox: true,
					CdsDateInput: true,
				},
				provide: {
					useToast: mockToast,
				},
			},
		});

		Object.entries(citizenInfo.asFormData).forEach(([name, value]) => {
			if (!wrapper.find(`[data-testid="test-${name}"]`).exists()) {
				return;
			}
			
			expect(wrapper.find(`[data-testid="test-${name}"]`).attributes().value).toBe(String(value) || undefined);
		})
	});
});
