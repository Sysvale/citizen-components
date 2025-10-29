<template>
	<CdsFlexbox
		gap="2"
		wrap="no-wrap"
		align="end"
		:fluid
	>
		<CdsFlexbox
			ref="selectContainer"
			direction="column"
			:fluid
		>
			<CdsTextInput
				v-model.trim="searchString"
				:state="computedState"
				:fluid
				@keydown.enter="search"
				@blur="isActive = false"
			/>

			<SelectDropdown
				v-if="isActive"
				v-model="internalValue"
				:options
				:fluid
				:options-field
			>
				<template #option="{ option }">
					<CdsText
						as="subheading-3"
						no-margin
					>
						<CdsText font-weight="semibold">
							{{ option['name'] }}
						</CdsText>
					</CdsText>
					<CdsText as="body-2">
						<br />
						CPF: {{ maskCpf(option['cpf']) }}
					</CdsText>
					<CdsText as="body-2">
						<br />
						CNS: {{ maskCns(option['cns']) }}
					</CdsText>
					<CdsText as="body-2">
						<br />
						Data de nascimento:
						{{ dmyFormatter(option['birth_date']) }}
					</CdsText>
				</template>
			</SelectDropdown>
		</CdsFlexbox>

		<CdsButton
			v-if="showButton"
			type="button"
			:text="buttonText"
			:variant
			:tooltip-text="buttonTooltipText"
			:disabled="shouldDisableButton"
			@button-click="search"
		/>
	</CdsFlexbox>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Ref, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { CitizenService } from '../services/citizen/citizen.service';
import SelectDropdown from './InternalComponents/SelectDropdown.vue';
import { maskCpf, maskCns } from '@sysvale/foundry';

const model = defineModel<CitizenSelectModelType>('modelValue');

const props = withDefaults(
	defineProps<{
		showButton: boolean;
		fluid?: boolean;
		variant?: string;
		optionsField?: keyof Citizen;
	}>(),
	{
		fluid: false,
		variant: 'green',
		optionsField: 'name',
	}
);

const citizenService = new CitizenService();
const internalValue = ref<CitizenSelectModelType>(null) as Ref<CitizenSelectModelType>;
const options = ref<Citizen[]>([]);
const isLoading = ref(false);
const isActive = ref(false);
const searchString = ref<string>('');
const lastSearchStringSearched = ref<string>('');
const selectContainer = useTemplateRef<HTMLDivElement>('selectContainer');

const shouldDisableButton = computed(() => {
	return isLoading.value || searchString.value.length < 2;
});

const buttonText = computed(() =>
	isActive.value &&
	lastSearchStringSearched.value !== searchString.value &&
	options.value.length
		? 'Buscar*'
		: 'Buscar'
);

const buttonTooltipText = computed(() => {
	if (isLoading.value) return 'Carregando...';
	if (searchString.value.length < 2) return 'Digite 2 ou mais caracteres.';

	return '';
});
const computedState = computed(() => (isLoading.value ? 'loading' : 'default'));
const payload = computed(() => ({
	searchString: searchString.value,
	page: 1,
	perPage: 1000,
}));

watch(internalValue, () => {
	if (!internalValue.value) {
		searchString.value = '';
	} else if (typeof internalValue.value === 'string') {
		searchString.value = internalValue.value;
	} else {
		const fieldValue = internalValue.value[props.optionsField];
		searchString.value = typeof fieldValue === 'string' ? fieldValue : '';
	}

	isActive.value = false;
	model.value = JSON.parse(JSON.stringify(internalValue.value));
});

onClickOutside(selectContainer, () => {
	isActive.value = false;
});

async function search() {
	if (shouldDisableButton.value) return;

	isLoading.value = true;
	lastSearchStringSearched.value = searchString.value;

	try {
		const citizensList = await citizenService.index(payload.value);
		options.value = citizensList.data;
		isActive.value = true;
	} catch (error) {
		isActive.value = false;
		console.error('Error fetching citizens:', error);

		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		throw new Error(`Error fetching citizens: ${errorMessage}`);
	} finally {
		isLoading.value = false;
	}
}

function dmyFormatter(date: string) {
	const [year, month, day] = date.split('-').map(Number);

	return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
}
</script>
