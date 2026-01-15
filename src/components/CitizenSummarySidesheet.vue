<template>
	<CdsSideSheet
		v-model="model"
		:title="title"
		size="lg"
		:no-close-on-backdrop="isLoading"
		:no-close-on-esc="isLoading"
		no-footer
		with-overlay
	>
		<CdsSpacer
			:margin-top="4"
			:margin-bottom="4"
		>
			<CdsSkeleton
				v-if="isLoading"
				width="200"
				height="30"
			/>
			<CdsText
				v-else
				as="subheading-2"
				no-margin
				font-weight="semibold"
				color="n-700"
			>
				{{ smartTitleCase(internalCitizen?.name) }}
			</CdsText>
			<CdsSpacer
				v-if="internalCitizen?.isPregnant"
				:margin-top="2"
			>
				<CdsBadge
					data-testid="pregnant-badge"
					variant="pink"
				>
					Gestante
				</CdsBadge>
			</CdsSpacer>
		</CdsSpacer>
		<CdsSpacer :margin-bottom="4">
			<SummarySectionSkeleton
				v-if="isLoading"
				title="Dados pessoais"
			/>
			<SummarySection
				v-else-if="internalCitizen"
				title="Dados pessoais"
				:items="internalCitizen.getPersonalInfo(hiddenFields)"
			/>
		</CdsSpacer>
		<SummarySectionSkeleton
			v-if="isLoading"
			title="Informações de contato"
		/>
		<SummarySection
			v-else-if="internalCitizen"
			title="Informações de contato"
			:items="internalCitizen?.getContactInfo(hiddenFields)"
		/>
	</CdsSideSheet>
</template>

<script setup lang="ts">
import { Citizen as CitizenModel } from '@/models/Citizen';
// @ts-ignore
import { smartTitleCase } from '@sysvale/foundry';
import SummarySection from './InternalComponents/SummarySection.vue';
import SummarySectionSkeleton from './InternalComponents/SummarySectionSkeleton.vue';
import { ref, watch } from 'vue';
import { CitizenService } from '@/services/citizen/citizen.service';

const model = defineModel({
	default: false,
	type: Boolean,
});

const props = withDefaults(defineProps<{
	citizen?: string,
	hiddenFields?: string[],
	title?: string,
}>(),
{
	citizen: '',
	hiddenFields: () => [],
	title: 'Detalhes do usuário SUS',
});

const internalCitizen = ref<CitizenModel | null>(null);
const citizenService = new CitizenService();
const isLoading = ref(false);

watch(model, (newValue) => {
	if (!newValue) {
		internalCitizen.value = null;
		return;
	}

	fetchCitizen();
});

async function fetchCitizen() {
	isLoading.value = true;
	citizenService.read({ search_string: props.citizen })
		.then(({ data }) => {
			if (data.length === 0 || !data[0]) {
				return;
			}

			internalCitizen.value = new CitizenModel(data[0]);
		})
		.finally(() => isLoading.value = false);
}
</script>