import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import CreateCitizenSidesheet from './CreateCitizenSidesheet.vue';
import { CitizenService } from '../services/citizen/citizen.service';
import '../constants/citizenFormRules';
import { defineComponent } from 'vue';
import { Citizen } from '@/models/Citizen';
import type { FormContext } from 'vee-validate';

vi.mock('../services/citizen/citizen.service');

const CdsSideSheetStub = defineComponent({
	props: {
		modelValue: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: 'Cadastrar cidadão',
		},
		okButtonText: {
			type: String,
			default: 'ok',
		},
		cancelButtonText: {
			type: String,
			default: 'cancel',
		},
	},
	emits: ['update:modelValue', 'ok', 'cancel'],
	template: `
        <div class="cds-sidesheet-mock">
            <slot></slot>
            <button data-testid="ok-button" @click="$emit('ok')">OK</button>
            <button data-testid="cancel-button" @click="$emit('cancel')">Cancel</button>
        </div>
    `,
});

const globalStubs = {
	CdsSideSheet: CdsSideSheetStub,
	CdsGrid: true,
	CdsGridItem: true,
	CdsTextInput: true,
	CdsDateInput: true,
	CdsSelect: true,
	SelectDropdown: true,
};

describe('CreateCitizenSidesheet', () => {
	const createWrapper = (props?: Record<string, any>) =>
		mount(CreateCitizenSidesheet, {
			global: {
				stubs: globalStubs,
			},
			props,
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
		const wrapper = createWrapper({ actionButtonVariant: 'teal' });
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

	test('should emit success event', () => {
		const wrapper = createWrapper();
		wrapper.vm.$emit('success');
		expect(wrapper.emitted('success')).toBeTruthy();
	});

	test('should emit error event', () => {
		const wrapper = createWrapper();
		wrapper.vm.$emit('error');
		expect(wrapper.emitted('error')).toBeTruthy();
	});

	test('should render form', async () => {
		const wrapper = createWrapper();
		const formRef = wrapper.findComponent({ ref: 'formRef' });

		expect(formRef.exists()).toBeTruthy();
	});

	describe('Sidesheet Form', () => {
		let mockCitizenCreate: ReturnType<typeof vi.fn>;
		let wrapper: VueWrapper<any>;
		let formRefInstance: FormContext;
		let okButton: DOMWrapper<any>;

		const mockFormData = {
			name: 'João da Silva',
			cns: '123 4567 8901 2345',
			cpf: '123.456.789-00',
			birth_date: '1990-01-01',
			gender: 'male',
		};
		const mockCitizenResponse = {
			data: {
				citizen: {
					id: '1',
					...mockFormData,
				},
			},
		};

		beforeEach(async () => {
			mockCitizenCreate = vi.fn().mockResolvedValue(mockCitizenResponse);
			CitizenService.prototype.create = mockCitizenCreate;

			wrapper = createWrapper({ modelValue: true });
			await wrapper.vm.$nextTick();
			formRefInstance = wrapper.vm.formRef;
			okButton = wrapper.find('[data-testid="ok-button"]');
		});

		afterEach(() => {
			vi.clearAllMocks();
		});

		test('should call service and emit success when validation is truthy', async () => {
			const expectedPayload = new Citizen(mockFormData).asRequestPayload();
			const validateSpy = vi.spyOn(formRefInstance, 'validate').mockResolvedValue({
				valid: true,
				errors: {},
				results: {},
				source: 'fields',
			});

			formRefInstance.setValues(mockFormData);
			await okButton.trigger('click');

			expect(validateSpy).toHaveBeenCalledTimes(1);

			await vi.waitFor(() => expect(mockCitizenCreate).toHaveBeenCalled());
			expect(mockCitizenCreate).toHaveBeenCalledWith(expectedPayload);
			expect(wrapper.emitted('success')).toBeTruthy();
			expect(wrapper.emitted('success')?.[0]).toEqual([mockCitizenResponse]);
			expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
		});

		test('should not call service and emit any events when validation is falsy', async () => {
			vi.spyOn(formRefInstance, 'validate').mockImplementationOnce(() =>
				Promise.resolve({ valid: false, errors: {}, results: {}, source: 'fields' })
			);

			await okButton.trigger('click');

			await vi.waitFor(() => expect(mockCitizenCreate).not.toHaveBeenCalled());
			expect(wrapper.emitted('success')).toBeFalsy();
			expect(wrapper.emitted('error')).toBeFalsy();
			expect(wrapper.emitted('update:modelValue')).toBeFalsy();
		});

		test('should emit error event when api call throws error', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			vi.spyOn(formRefInstance, 'validate').mockImplementationOnce(() =>
				Promise.resolve({ valid: true, errors: {}, results: {}, source: 'fields' })
			);
			mockCitizenCreate.mockRejectedValue(new Error('Network error'));

			formRefInstance.setValues(mockFormData);
			await okButton.trigger('click');
			await vi.waitFor(() => expect(consoleErrorSpy).toHaveBeenCalled());

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Error creating citizen:',
				expect.any(Error)
			);
			expect(wrapper.emitted('success')).toBeFalsy();
			expect(wrapper.emitted('error')).toBeTruthy();
			expect(wrapper.emitted('error')?.[0]).toEqual(['Network error']);
			expect(wrapper.emitted('update:modelValue')).toBeFalsy();
		});
	});
});
