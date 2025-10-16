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
				v-model="searchString"
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
						<br>
						CPF: {{ option['cpf'] }}
					</CdsText>
					<CdsText as="body-2">
						<br>
						CNS: {{ option['cns'] }}
					</CdsText>
					<CdsText as="body-2">
						<br>
						Data de nascimento: {{ option['birth_date'] }}
					</CdsText>
				</template>
			</SelectDropdown>
		</CdsFlexbox>

		<CdsButton
			v-if="showButton"
			text="Buscar"
			:variant="variant ?? 'green'"
			@button-click="search"
		/>
	</CdsFlexbox>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Ref, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { CitizenService } from '../services/citizen/citizen.service';
import SelectDropdown from './InternalComponents/SelectDropdown.vue';

const model = defineModel<CitizenModelType>('modelValue');

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

const selectContainer =
	useTemplateRef<HTMLDivElement>('selectContainer');

const citizenService = new CitizenService();
const internalValue = ref<CitizenModelType>(
	null
) as Ref<CitizenModelType>;
const options = ref<Citizen[]>([]);
const isLoading = ref(false);
const isActive = ref(false);
const searchString = ref<string>('');

const computedState = computed(() =>
	isLoading.value ? 'loading' : 'default'
);

watch(internalValue, () => {
	if (!internalValue.value) {
		searchString.value = '';
	} else if (typeof internalValue.value === 'string') {
		searchString.value = internalValue.value;
	} else {
		const fieldValue = internalValue.value[props.optionsField];
		searchString.value =
			typeof fieldValue === 'string' ? fieldValue : '';
	}

	isActive.value = false;
	model.value = JSON.parse(JSON.stringify(internalValue.value));
});

function search() {
	isLoading.value = true;

	citizenService
		.search({ searchString: searchString.value })
		.then(data => {
			options.value = data;
			isActive.value = true;
		})
		.catch(error => {
			isActive.value = false;
			console.error('Error fetching citizens:', error);

			const errorMessage =
				error instanceof Error
					? error.message
					: 'Unknown error';
			throw new Error(`Error fetching citizens: ${errorMessage}`);
		})
		.finally(() => {
			isLoading.value = false;
		});
}

onClickOutside(selectContainer, () => {
	isActive.value = false;
});
</script>
