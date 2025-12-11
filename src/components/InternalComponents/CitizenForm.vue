<template>
	<Form ref="formRef">
		<CdsGrid
			col-gap="2"
			:cols="12"
		>
			<CdsGridItem
				v-for="formField in formFields"
				:key="formField.name"
				:col-span="formField.colSpan"
				:class="formField.name === 'pregnant' ? 'pregnant__container' : ''"
			>
				<Field
					:ref="`validation${startCase(formField.name)}Ref`"
					v-slot="{ field, errors, meta }"
					v-bind="formField"
					as=""
				>
					<CdsSelect
						v-if="formField.name === 'city'"
						v-model="field.value"
						v-bind="{
							...field,
							...formField,
						}"
						:options="cities"
						:data-testid="`test-${formField.name}`"
						:state="resolveInputState(meta)"
						:error-message="errors[0]"
						:disabled="resolveDisabledState(formField.name) || isLoadingCities"
						fluid
					/>
					<component
						:is="formField.component"
						v-else
						v-bind="{
							...field,
							...formField,
						}"
						v-model="field.value"
						:data-testid="`test-${formField.name}`"
						:disabled="resolveDisabledState(formField.name)"
						:state="resolveInputState(meta)"
						:error-message="errors[0]"
						class="field__container"
						fluid
						@update:model-value="(event: any) => handleFieldInput(formField.name, event)"
					/>
				</Field>
			</CdsGridItem>
		</CdsGrid>
	</Form>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, inject, watch } from 'vue';
import { Form, Field, type FormContext } from 'vee-validate';
import inputStateResolver from '@/utils/inputStateResolver';
import citizenFormFields from '@/constants/citizenFormFields';
import { getCitiesByUf } from '@/services/ibge';
import { startCase } from 'lodash';
import { Citizen } from '@/models/Citizen';

const props = withDefaults(
	defineProps<{
		disabledFields?: string[] | 'all';
		initialData?: object | null;
		hiddenFields?: string[];
		disabled?: boolean;
	}>(),
	{
		initialData: null,
		disabledFields: () => ([]),
		hiddenFields: () => ([]),
		disabled: false,
	}
);

const useToast = inject('useToast');

const formRef = ref<FormContext | null>(null);
const validationCityRef = ref<any[] | null>(null);
const cities = ref<object[]>([]);
const isLoadingCities = ref<boolean>(false);
const internalCitizen = ref<Citizen>(new Citizen({}));

const formFields = computed(() => citizenFormFields(props.hiddenFields));

onMounted(() => {
	if (!props.initialData) return;

	fillForm(props.initialData);
});

watch(
	() => props.initialData,
	(newValue) => {
		if (!newValue) return;

		fillForm(newValue);
	}
);

function resolveInputState(meta: any) {
	return inputStateResolver(meta);
}

function fillForm(citizenData: object) {
	internalCitizen.value = new Citizen(citizenData);
	formRef.value?.resetForm({ values: internalCitizen.value.asFormData() });

	if (!internalCitizen.value.uf) return;

	handleUfSelect(internalCitizen.value.uf.ibgeCode);
}

function resolvePregnantFieldDisabledState() {
	if (!formRef.value) return false;

	return formRef.value?.values.gender?.value !== 'F';
}

function resolveDisabledState(fieldName: string) {
	if (props.disabled || props.disabledFields.includes(fieldName) || props.disabledFields === 'all') {
		return true;
	}

	switch (fieldName) {
		case 'pregnant':
			return resolvePregnantFieldDisabledState();
		case 'city':
			return !formRef.value?.values.uf;
		default:
			return false;
	}
}

function handleGenderChange(gender: 'M' | 'F') {
	if (gender === 'F') {
		return;
	}

	formRef.value?.setFieldValue('pregnant', null);
}

function handleUfSelect(ibgeCode: string | number) {
	isLoadingCities.value = true;

	getCitiesByUf(ibgeCode)
		.then((response: { data: Array<{ nome: string }> }) => {
			cities.value = response.data.map((city) => ({ id: city.nome, value: city.nome }));
		})
		.catch(() => {
			// @ts-ignore
			useToast().fire({
				title: 'Erro ao buscar cidades',
				description: `Não foi possível carregar a lista de cidades.
					Se o problema persistir, contate o suporte.`,
				dismissible: true,
				dismissAfter: 6000,
				autoDismissible: true,
				variant: 'danger',
				light: false,
			});
		})
		.finally(() => {
			isLoadingCities.value = false;
		});
}

function handleFieldInput(fieldName: string, fieldValue: any) {
	switch (fieldName) {
		case 'gender':
			handleGenderChange(fieldValue.value);
			break;
		case 'uf':
			validationCityRef.value?.[0].reset();
			handleUfSelect(fieldValue.ibgeCode);
			break;
		default:
			break;
	}
}

defineExpose({
	validate: () => new Promise((resolve, reject) => {
		formRef.value?.validate()
			.then((response) => {
				if (!response.valid) {
					console.log(response);
					reject(new Error('validation'));
					return;
				}

				resolve({
					...formRef.value?.values,
					id: internalCitizen.value.id,
				});
			})
			.catch(reject);
	}),
	resetForm: () => formRef.value?.resetForm(),
});
</script>

<style lang="scss" scoped>
@import '@sysvale/cuida/dist/@sysvale/tokens.scss';

.pregnant__container {
	padding: pt(2);
	height: 100%;
}

.field__container {
	min-height: 80px;
}
</style>
