import CitizenSummaryViewer from './CitizenSummaryViewer.vue';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import type { Citizen } from '@/types';
// @ts-ignore
import Cuida from '@sysvale/cuida';

const maleCitizen: Partial<Citizen> = {
	name: 'John Doe',
	birth_date: '1990-01-15',
	cpf: '12345678900',
	cns: '12345678900',
	gender: 'M',
	identification_document: '12345678900',
	phone: '1234567890',
	email: 'sB2Q7@example.com',
	address: {
		cep: '12345678',
		street: 'Main Street',
		number: '123',
		complement: 'Apt 1',
		neighborhood: 'Downtown',
		city: 'New York',
		uf: 'NY',
	},
	race: 'white',
	co_cidadao: 1,
	is_dead: false,
	pregnant: false,
	issuing_agency: 'SSP',
	mother_name: 'Jane Doe',
	cellphone: '1234567890',
};

const femaleCitizen: Partial<Citizen> = {
	...maleCitizen,
	name: 'Jane Doe',
	gender: 'F',
	pregnant: true,
	mother_name: 'Mary Doe',
};

const incompleteCitizen: Partial<Citizen> = {
	...maleCitizen,
	mother_name: '',
};

const stubs = {
	CdsText: true,
	CdsBadge: true,
	CdsIconButton: true,
	SummarySection: true,
}

describe('CitizenSummaryViewer', () => {
	let wrapper: VueWrapper<any>;

	beforeEach(() => {
		wrapper = mount(CitizenSummaryViewer, {
			props: {
				citizen: maleCitizen,
			},
			global: {
				plugins: [Cuida],
				stubs,
			},
		});
	});

	afterEach(() => {
		wrapper.unmount();
	});

	test('is rendered correctly', () => {
		expect(wrapper.html()).toMatchSnapshot();
	});

	test('pregnant badge is show correctly', async () => {
		const pregnantCitizenWrapper = await mount(CitizenSummaryViewer, {
			props: {
				citizen: femaleCitizen,
			},
			global: {
				plugins: [Cuida],
				stubs,
			},
		});

		expect(wrapper.findComponent('[data-testid="pregnant-badge"]').exists()).toBeFalsy();
		expect(pregnantCitizenWrapper.findComponent('[data-testid="pregnant-badge"]').exists()).toBeTruthy();

		pregnantCitizenWrapper.unmount();
	});

	test('actions are hidden accordingly to props', async () => {
		expect.assertions(8);

		expect(wrapper.findComponent('[data-testid="edit-button"]').exists()).toBeTruthy();
		expect(wrapper.findComponent('[data-testid="close-button"]').exists()).toBeTruthy();

		await wrapper.setProps({
			hideEditButton: true,
			hideCloseButton: false,
		});

		expect(wrapper.findComponent('[data-testid="edit-button"]').exists()).toBeFalsy();
		expect(wrapper.findComponent('[data-testid="close-button"]').exists()).toBeTruthy();

		await wrapper.setProps({
			hideCloseButton: true,
			hideEditButton: false,
		});

		expect(wrapper.findComponent('[data-testid="edit-button"]').exists()).toBeTruthy();
		expect(wrapper.findComponent('[data-testid="close-button"]').exists()).toBeFalsy();

		await wrapper.setProps({
			hideCloseButton: false,
			hideEditButton: false,
			hideActions: true,
		});

		expect(wrapper.findComponent('[data-testid="edit-button"]').exists()).toBeFalsy();
		expect(wrapper.findComponent('[data-testid="close-button"]').exists()).toBeFalsy();
	});

	test('edit event is emitted succesfully', () => {
		const editButton = wrapper.findComponent('[data-testid="edit-button"]');
		editButton.trigger('cds-click');
		expect(wrapper.emitted('edit')).toBeTruthy();
	});

	test('close event is emitted succesfully', () => {
		const closeButton = wrapper.findComponent('[data-testid="close-button"]');
		closeButton.trigger('cds-click');
		expect(wrapper.emitted('close')).toBeTruthy();
	});

	test('shows missing fields warning and amber variant when required fields are missing', async () => {
		const incompleteCitizenWrapper = await mount(CitizenSummaryViewer, {
			props: {
				citizen: incompleteCitizen,
			},
			global: {
				plugins: [Cuida],
				stubs: {
					...stubs,
					CdsText: false,
				},
			},
		});

		const missingFieldsAlert = incompleteCitizenWrapper.find('[data-testid="missing-fields-alert"]');

		expect(incompleteCitizenWrapper.vm.hasMissingFields).toBeTruthy();
		expect(incompleteCitizenWrapper.find('.box--amber').exists()).toBeTruthy();
		expect(missingFieldsAlert.exists()).toBeTruthy();
		expect(missingFieldsAlert.find('svg[aria-labelledby="warning-outline"]').exists()).toBeTruthy();
		expect(missingFieldsAlert.text()).toContain('Cadastro incompleto');

		incompleteCitizenWrapper.unmount();
	});

	test('should not show missing fields warning when hidden fields fields are missing', async () => {
		const incompleteCitizenWrapper = await mount(CitizenSummaryViewer, {
			props: {
				citizen: incompleteCitizen,
				hiddenFields: ['mother_name'],
			},
			global: {
				plugins: [Cuida],
				stubs: {
					...stubs,
					CdsText: false,
				},
			},
		});

		expect(incompleteCitizenWrapper.find('[data-testid="missing-fields-alert"]').exists()).toBeFalsy();
		expect(incompleteCitizenWrapper.vm.hasMissingFields).toBeFalsy();
		expect(incompleteCitizenWrapper.find('.box--amber').exists()).toBeFalsy();

		incompleteCitizenWrapper.unmount();
	});
});
