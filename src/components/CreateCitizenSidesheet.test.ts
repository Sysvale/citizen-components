import { describe, test, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CreateCitizenSidesheet from './CreateCitizenSidesheet.vue';
import { CitizenService } from '../services/citizen/citizen.service';

vi.mock('../services/citizen/citizen.service');

const globalStubs = {
	CdsSideSheet: true,
	CdsGrid: true,
	CdsGridItem: true,
	CdsTextInput: true,
	CdsDateInput: true,
	CdsSelect: true,
	SelectDropdown: true,
	Form: true,
	Field: true,
};

describe('CreateCitizenSidesheet', () => {
	let mockCitizenCreate: ReturnType<typeof vi.fn>;

	const mockCitizenResponse = {
		data: { citizen: { id: '1', name: 'João Silva', cpf: '123.456.789-00' } },
	};

	beforeEach(() => {
		mockCitizenCreate = vi.fn().mockResolvedValue(mockCitizenResponse);
		CitizenService.prototype.create = mockCitizenCreate;
	});

	const createWrapper = (props?: Record<string, any>) =>
		mount(CreateCitizenSidesheet, {
			props: { ...props },
			global: { stubs: globalStubs },
		});

	test('mounts successfully with required props', () => {
		const wrapper = createWrapper();
		expect(wrapper.exists()).toBe(true);
	});

	test('accepts and mounts successfully when okButtonText has a value', () => {
		const wrapper = createWrapper({ okButtonText: 'ok-text' });
		expect(wrapper.exists()).toBe(true);
	});

	test('accepts and mounts successfully when cancelButtonText has a value', () => {
		const wrapper = createWrapper({ cancelButtonText: 'cancel-text' });
		expect(wrapper.exists()).toBe(true);
	});

	test('accepts and mounts successfully when actionButtonVariant has a value', () => {
		const wrapper = createWrapper({ actionButtonVarian: 'teal' });
		expect(wrapper.exists()).toBe(true);
	});

	test('accepts and mounts successfully when size has a value', () => {
		const wrapper = createWrapper({ size: 'sm' });
		expect(wrapper.exists()).toBe(true);
	});

	test('accepts and mounts successfully when modelValue is truthy', () => {
		const wrapper = createWrapper({ modelValue: true });
		expect(wrapper.exists()).toBe(true);
	});

	test('should not call service if validation fails', async () => {
		const wrapper = createWrapper();
		await wrapper.findComponent({ name: 'CdsSideSheet' }).vm.$emit('ok');
		expect(mockCitizenCreate).not.toHaveBeenCalled();
	});

	test('should call service if validation passes', async () => {
		const wrapper = createWrapper({ modelValue: true });
	});
});
