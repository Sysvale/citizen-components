<template>
	<CdsFlexbox
		gap="2"
		wrap="no-wrap"
		:fluid
	>
		<CdsFlexbox
			ref="selectContainer"
			direction="column"
			:fluid
		>
			<CdsTextInput
				v-bind="$attrs"
				v-model.trim="searchString"
				state="default"
				:fluid
				:disabled="isLoading || disabled"
				@keydown.enter="search"
				@blur="isActive = false"
			/>

			<SelectDropdown
				v-if="isActive"
				v-model="model"
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
						<br>
						CPF: {{ option['cpf'] ? maskCpf(option['cpf']) : '--' }}
					</CdsText>
					<CdsText as="body-2">
						<br>
						CNS: {{ option['cns'] ? maskCns(option['cns']) : '--' }}
					</CdsText>
					<CdsText as="body-2">
						<br>
						Data de nascimento:
						{{ dmyFormatter(option['birth_date']) }}
					</CdsText>
				</template>
			</SelectDropdown>
		</CdsFlexbox>

		<CdsButton
			v-if="showButton"
			class="mt-6"
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
import {
	ref,
	computed,
	watch,
	useTemplateRef,
	inject
} from 'vue';
import { onClickOutside } from '@vueuse/core';
import { CitizenService } from '../services/citizen/citizen.service';
import SelectDropdown from './InternalComponents/SelectDropdown.vue';
import { maskCpf, maskCns } from '@sysvale/foundry';

const useToast = inject('useToast');

defineOptions({
	inheritAttrs: false
})

const model = defineModel<CitizenSelectModelType>('modelValue');

const props = withDefaults(
	defineProps<{
		showButton: boolean;
		fluid?: boolean;
		variant?: string;
		optionsField?: keyof Citizen;
		disabled?: boolean;
	}>(),
	{
		fluid: false,
		variant: 'green',
		optionsField: 'name',
		disabled: false,
	}
);

const citizenService = new CitizenService();
const options = ref<Citizen[]>([]);
const isLoading = ref(false);
const isActive = ref(false);
const searchString = ref<string>('');
const lastSearchStringSearched = ref<string>('');
const selectContainer = useTemplateRef<HTMLDivElement>('selectContainer');

const shouldDisableButton = computed(() => {
	return props.disabled || isLoading.value || searchString.value.length < 2;
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
const payload = computed(() => ({
	search_string: searchString.value,
	page: 1,
	per_page: 1000,
}));

watch(model, () => {
	if (!model.value) {
		searchString.value = '';
	} else if (typeof model.value === 'string') {
		searchString.value = model.value;
	} else {
		const fieldValue = model.value[props.optionsField];
		searchString.value = typeof fieldValue === 'string' ? fieldValue : '';
	}

	isActive.value = false;
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
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		useToast().fire({
			title: 'Houve um problema ao buscar as informações as informações do cidadão.',
			description: errorMessage,
			dismissible: true,
			dismissAfter: 6000,
			autoDismissible: true,
			variant: 'danger',
			light: false,
		})
	} finally {
		isLoading.value = false;
	}
}

function dmyFormatter(date: string) {
	const [year, month, day] = date.split('-').map(Number);

	return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
}
</script>
