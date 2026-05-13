/* eslint-disable vue/one-component-per-file */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import CitizenSummarySidesheet from './CitizenSummarySidesheet.vue';
import { CitizenService } from '@/services/citizen/citizen.service';
// @ts-ignore
import Cuida from '@sysvale/cuida';

const CdsSpacerStub = defineComponent({
	template: '<div data-testid="spacer"><slot /></div>',
});

const CdsSideSheetStub = defineComponent({
	template: '<div data-testid="sidesheet"><slot /></div>',
});

const CdsTextStub = defineComponent({
	template: '<div data-testid="citizen-name"><slot /></div>',
});

const CdsBadgeStub = defineComponent({
	inheritAttrs: false,
	template: '<div v-bind="$attrs"><slot /></div>',
});

const SummarySectionStub = defineComponent({
	props: {
		items: {
			type: Array,
			default: () => [],
		},
		title: {
			type: String,
			default: '',
		},
	},
	template: '<div data-testid="summary-section">{{ title }}: {{ items.length }}</div>',
});

const SummarySectionSkeletonStub = defineComponent({
	props: {
		title: {
			type: String,
			default: '',
		},
	},
	template: '<div data-testid="summary-skeleton">{{ title }}</div>',
});

const globalStubs = {
	CdsSideSheet: CdsSideSheetStub,
	CdsSpacer: CdsSpacerStub,
	CdsSkeleton: true,
	CdsText: CdsTextStub,
	CdsBadge: CdsBadgeStub,
	SummarySection: SummarySectionStub,
	SummarySectionSkeleton: SummarySectionSkeletonStub,
};

const baseCitizen = {
	id: '1',
	name: 'Maria Silva',
	birth_date: '1990-01-01',
	cpf: '12345678900',
	cns: '12345678900',
	gender: 'F',
	identification_document: '12345678900',
	phone: '1234567890',
	email: 'maria@example.com',
	address: {
		cep: '12345678',
		street: 'Rua A',
		number: '123',
		complement: 'Apto 1',
		neighborhood: 'Centro',
		city: 'Sao Paulo',
		uf: 'SP',
	},
	race: 'white',
	pregnant: true,
};

describe('CitizenSummarySidesheet', () => {
	let wrapper: VueWrapper<any>;
	let readSpy: any;

	const createWrapper = (props?: Record<string, any>) =>
		mount(CitizenSummarySidesheet, {
			props: {
				modelValue: false,
				citizen: '12345678900',
				...props,
			},
			global: {
				plugins: [Cuida],
				stubs: globalStubs,
			},
		});

	beforeEach(() => {
		readSpy = vi.spyOn(CitizenService.prototype, 'read');
	});

	afterEach(() => {
		readSpy.mockRestore();
		wrapper?.unmount();
	});

	test('loads summary data correctly', async () => {
		readSpy.mockResolvedValueOnce(baseCitizen);

		wrapper = createWrapper();
		await wrapper.setProps({ modelValue: true });

		await vi.waitFor(() =>
			expect(readSpy).toHaveBeenCalledWith({ id: '12345678900' })
		);

		await vi.waitFor(() =>
			expect(wrapper.find('[data-testid="citizen-name"]').exists()).toBe(true)
		);

		expect(wrapper.find('[data-testid="citizen-name"]').text()).toContain('Maria Silva');
	});

	test('pregnant badge is show correctly', async () => {
		readSpy.mockResolvedValueOnce(baseCitizen);

		wrapper = createWrapper();
		await wrapper.setProps({ modelValue: true });

		await vi.waitFor(() =>
			expect(wrapper.find('[data-testid="pregnant-badge"]').exists()).toBe(true)
		);
	});

	test('skeleton is shown when loading', async () => {
		// eslint-disable-next-line no-unused-vars
		let resolveRead!: (value: { data: any[] }) => void;
		const pendingPromise = new Promise<{ data: any[] }>(resolve => {
			resolveRead = resolve;
		});

		readSpy.mockReturnValueOnce(pendingPromise);

		wrapper = createWrapper();
		await wrapper.setProps({ modelValue: true });
		await nextTick();

		expect(wrapper.find('[data-testid="summary-skeleton"]').exists()).toBe(true);

		resolveRead(baseCitizen);
		await vi.waitFor(() =>
			expect(wrapper.find('[data-testid="summary-skeleton"]').exists()).toBe(false)
		);
	});
});
