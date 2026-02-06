<template>
	<Form ref="formRef">
		<CdsSpacer :margin-bottom="4">
			<CdsText
				class="conditional__indicator"
				as="caption"
				font-weight="semibold"
			>
				** - Campos condicionais. Pelo menos um deles precisa ser preenchido.
			</CdsText>
		</CdsSpacer>
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
						v-if="formField.name === 'uf'"
						v-model="field.value"
						v-bind="{
							...field,
							...formField,
						}"
						:options="resolvedUfs"
						:data-testid="`test-${formField.name}`"
						:state="resolveInputState(meta)"
						:error-message="errors[0]"
						:disabled="resolveDisabledState(formField.name) || isLoadingCities"
						options-field="shortName"
						fluid
						@update:model-value="(event: any) => handleFieldInput(formField.name, event)"
					/>
					<CdsSelect
						v-else-if="formField.name === 'city'"
						v-model="field.value"
						v-bind="{
							...cleanVeeValidateField(field, selectFieldHiddenProps),
							...formField,
						}"
						:options="cities"
						:data-testid="`test-${formField.name}`"
						:state="resolveInputState(meta)"
						:error-message="errors[0]"
						:disabled="resolveDisabledState(formField.name) || isLoadingCities"
						fluid
						searchable
						deep-search
						@update:model-value="(event: any) => handleFieldInput(formField.name, event)"
					/>
					<CdsSelect
						v-else-if="formField.name === 'neighborhood'"
						v-model="field.value"
						v-bind="{
							...cleanVeeValidateField(field, selectFieldHiddenProps),
							...formField,
						}"
						:options="neighborhoods"
						:data-testid="`test-${formField.name}`"
						:state="resolveInputState(meta)"
						:error-message="errors[0]"
						:disabled="resolveDisabledState(formField.name) || isLoadingNeighborhoods"
						fluid
						searchable
						deep-search
						addable
						@update:model-value="(event: any) => handleFieldInput(formField.name, event)"
					/>
					<CdsSelect
						v-else-if="formField.name === 'street'"
						v-model="field.value"
						v-bind="{
							...cleanVeeValidateField(field, selectFieldHiddenProps),
							...formField,
						}"
						:options="streets"
						:data-testid="`test-${formField.name}`"
						:state="resolveInputState(meta)"
						:error-message="errors[0]"
						:disabled="resolveDisabledState(formField.name) || isLoadingStreets"
						fluid
						searchable
						deep-search
						addable
					/>
					<CdsTextInput
						v-else-if="['cpf', 'cns'].includes(formField.name)"
						v-model="field.value"
						v-bind="{
							...field,
							...formField,
						}"
						:data-testid="`test-${formField.name}`"
						:disabled="resolveDisabledState(formField.name) || isLoadingCities"
						fluid
						:state="resolveInputState(meta)"
						:error-message="errors[0]"
					>
						<template #label>
							<CdsSpacer :margin-bottom="2">
								<CdsFlexbox>
									<CdsText
										as="caption"
										font-weight="semibold"
									>
										{{ formField.label }}
									</CdsText>
									<CdsText
										class="conditional__indicator"
										as="caption"
										font-weight="semibold"
									>
										**
									</CdsText>
								</CdsFlexbox>
							</CdsSpacer>
						</template>
					</CdsTextInput>
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
import citizenFormFields from '@/constants/citizenFormFields';
import ufs from '@/constants/ufs';
import { Citizen } from '@/models/Citizen';
import { getCitiesByUf } from '@/services/ibge';
import { getNeighborhoodsByCityAndUf, getStreetsFromNeighborhoods } from '@/services/localities/localities.service';
import { cleanVeeValidateField } from '@/utils/cleanVeeValidateField';
import clearValidationRefs from '@/utils/clearValidationRefs';
import inputStateResolver from '@/utils/inputStateResolver';
import { startCase } from 'lodash';
import { Field, Form, type FormContext } from 'vee-validate';
import { computed, inject, onMounted, ref, watch, useTemplateRef } from 'vue';

const props = withDefaults(
	defineProps<{
		disabledFields?: string[] | 'all';
		initialData?: object | null;
		hiddenFields?: string[];
		disabled?: boolean;
		allowedUfs?: string[] | null;
		allowedCities?: string[] | null;
	}>(),
	{
		initialData: null,
		disabledFields: () => ([]),
		hiddenFields: () => ([]),
		disabled: false,
		allowedUfs: null,
		allowedCities: null,
	}
);

const useToast = inject('useToast');

const formRef = ref<FormContext | null>(null);
const validationCityRef = useTemplateRef<any[] | null>('validationCityRef');
const validationNeighborhoodRef = useTemplateRef<any[] | null>('validationNeighborhoodRef');
const validationStreetRef = useTemplateRef<any[] | null>('validationStreetRef');
const cities = ref<{ id: string; value: string }[]>([]);
const streets = ref<{ id: string; value: string }[]>([]);
const neighborhoods = ref<{ id: string; value: string }[]>([]);
const isLoadingCities = ref<boolean>(false);
const isLoadingStreets = ref<boolean>(false);
const isLoadingNeighborhoods = ref<boolean>(false);
const internalCitizen = ref<Citizen>(new Citizen({}));
const selectFieldHiddenProps = ['onChange', 'onInput'];

const formFields = computed(() => citizenFormFields(props.hiddenFields));
const resolvedUfs = computed(() => {
	if (!props.allowedUfs) return ufs;

	return ufs.filter((uf) => props.allowedUfs?.includes(uf.shortName));
});

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
	internalCitizen.value.city && handleCitySelect(internalCitizen.value.city.value);
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
		case 'neighborhood':
			return !formRef.value?.values.uf || !formRef.value?.values.city;
		case 'street':
			return !formRef.value?.values.uf || !formRef.value?.values.city || !formRef.value?.values.neighborhood;
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

			if (!props.allowedCities) return;

			cities.value = cities.value.filter(({ id }) => props.allowedCities?.includes(id));
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

async function handleCitySelect(cityName: string) {
	isLoadingNeighborhoods.value = true;
	const cityUfObject = {
		city: cityName,
		uf: formRef.value?.values.uf.shortName,
	}

	getNeighborhoodsByCityAndUf(cityUfObject)
		.then((response: { data: Array<{ id: string, name: string }> }) => {
			neighborhoods.value = response.data.map((neighborhood) => ({ id: neighborhood.name, value: neighborhood.name }));

			if (!internalCitizen.value.neighborhood || !neighborhoods.value.find(({ id }) => id === internalCitizen.value.neighborhood?.id)) {
				return;
			}

			handleNeighborhoodSelect(internalCitizen.value.neighborhood);
		}).catch(() => {
			// @ts-ignore
			useToast().fire({
				title: 'Erro ao buscar bairros',
				description: `Não foi possível carregar a lista de bairros.
					Se o problema persistir, contate o suporte.`,
				dismissible: true,
				dismissAfter: 6000,
				autoDismissible: true,
				variant: 'danger',
				light: false,
			});
		})
		.finally(() => {
			isLoadingNeighborhoods.value = false;
		});
}

async function handleNeighborhoodSelect(neighborhood: { id: string, value: string }) {
	isLoadingStreets.value = true;
	const neighborhoodCityUfObject = {
		neighborhood_name: neighborhood.value, 
		city: formRef.value?.values.city.value,
		uf: formRef.value?.values.uf.shortName,
	}

	getStreetsFromNeighborhoods(neighborhoodCityUfObject)
		.then((response: { data: Array<{ name: string }> }) => {
			streets.value = response.data.map((street) => ({ id: street.name, value: street.name }));
		}).catch(() => {
			// @ts-ignore
			useToast().fire({
				title: 'Erro ao buscar ruas',
				description: `Não foi possível carregar a lista de ruas.
					Se o problema persistir, contate o suporte.`,
				dismissible: true,
				dismissAfter: 6000,
				autoDismissible: true,
				variant: 'danger',
				light: false,
			});
		})
		.finally(() => {
			isLoadingStreets.value = false;
		});
}

function handleFieldInput(fieldName: string, fieldValue: any) {
	switch (fieldName) {
		case 'gender':
			handleGenderChange(fieldValue.value);
			break;
		case 'uf':
			clearValidationRefs([validationCityRef, validationNeighborhoodRef, validationStreetRef]);
			handleUfSelect(fieldValue.ibgeCode);
			break;
		case 'city':
			clearValidationRefs([validationNeighborhoodRef, validationStreetRef]);
			handleCitySelect(fieldValue.value);
			break;
		case 'neighborhood':
			clearValidationRefs([validationStreetRef]);
			handleNeighborhoodSelect(fieldValue);
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

.conditional__indicator {
	color: $rc-600 !important;
}
</style>
