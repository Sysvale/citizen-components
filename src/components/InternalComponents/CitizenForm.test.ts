import CitizenForm from './CitizenForm.vue';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import '../../utils/rules/citizenFormRules';
// @ts-ignore
import Cuida from '@sysvale/cuida';

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
				}
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

		expect(wrapper.find('[data-testid="test-name"]').attributes().disabled).toBe('true');
		expect(wrapper.find('[data-testid="test-cpf"]').attributes().disabled).toBe('true');
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
});
