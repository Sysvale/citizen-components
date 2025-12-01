<template>
	<CdsSideSheet
		v-bind="$attrs"
		v-model="model"
		title="Cadastrar usuário SUS"
		size="lg"
		no-close-ok-button
		:disable-ok-button="isLoading || $attrs['disable-ok-button']"
		:disable-cancel-button="isLoading || $attrs['disable-cancel-button']"
		:block-ok-button="true"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<Form ref="formRef">
			<CdsGrid
				:cols="6"
				col-gap="2"
				row-gap="4"
			>
				<CdsGridItem
					v-for="formField in formFields"
					:key="formField.name"
					:col-span="formField.colSpan"
					:class="formField.name === 'pregnant' ? 'pregnant__container' : ''"
				>
					<Field
						v-slot="{ field, errors, meta }"
						v-bind="formField"
						as=""
					>
						<component
							:is="formField.component"
							v-bind="{
								...field,
								...formField,
							}"
							v-model="field.value"
							fluid
							:disabled="resolveDisabledState(formField.name)"
							:state="inputStateResolver(meta)"
							:error-message="errors[0]"
							@update:model-value="(event: any) => handleFieldInput(formField.name, event)"
						/>
					</Field>
				</CdsGridItem>
			</CdsGrid>
		</Form>
	</CdsSideSheet>
</template>
<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { Form, Field, type FormContext } from 'vee-validate';
import inputStateResolver from '@/utils/inputStateResolver';
import { CitizenService } from '@/services/citizen/citizen.service';
import { Citizen } from '@/models/Citizen';
import citizenFormFields from '@/constants/citizenFormFields';

const useToast = inject('useToast');

const props = withDefaults(
	defineProps<{
		toastSuccessDescription?: string;
		toastErrorDescription?: string;
		disabledFields?: string[] | 'all';
		hiddenFields?: string[];
	}>(),
	{
		toastSuccessDescription: 'Cidadão cadastrado com sucesso.',
		toastErrorDescription: 'Houve um erro ao cadastrar o cidadão.',
		disabledFields: () => ([]),
		hiddenFields: () => ([]),
	}
);

const emits = defineEmits(['success']);

const model = defineModel<boolean>();
const formRef = ref<FormContext | null>(null);
const isLoading = ref(false);
const citizenService = new CitizenService();

const formFields = computed(() => citizenFormFields(props.hiddenFields));

async function handleOk() {
	let formValidationResult;

	if (!formRef.value) return;

	try {
		formValidationResult = await formRef.value.validate();
	} catch (error) {
		console.error(error);
		// @ts-ignore
		useToast().fire({
			title: 'Erro ao validar o formulário',
			description:
				'Houve um erro ao validar o formulário. Se o problema persistir, contate o suporte.',
			dismissible: true,
			dismissAfter: 6000,
			autoDismissible: true,
			variant: 'danger',
			light: false,
		});
	}

	if (!formValidationResult?.valid) return;

	try {
		isLoading.value = true;
		const citizen = await citizenService.create(
			new Citizen(formRef.value.values).asRequestPayload()
		);

		formRef.value.resetForm();
		model.value = false;

		// @ts-ignore
		useToast().fire({
			title: 'Sucesso',
			description: props.toastSuccessDescription,
			dismissible: true,
			dismissAfter: 6000,
			autoDismissible: true,
			variant: 'success',
			light: false,
		});
		emits('success', citizen);
	} catch (error) {
		let errorMessage;

		console.error('Error:', error);
		if (error instanceof Error) {
			errorMessage =
				error.message === ''
					? props.toastErrorDescription
					: error.message;
		}

		// @ts-ignore
		useToast().fire({
			title: 'Erro',
			description: errorMessage,
			dismissible: true,
			dismissAfter: 6000,
			autoDismissible: true,
			variant: 'danger',
			light: false,
		});
	} finally {
		isLoading.value = false;
	}
}

function handleCancel() {
	formRef.value?.resetForm();
}

function resolvePregnantFieldDisabledState() {
	if (!formRef.value) return false;

	return formRef.value?.values.gender?.value !== 'F';
}

function resolveDisabledState(fieldName: string) {
	if (isLoading.value || props.disabledFields.includes(fieldName) || props.disabledFields === 'all') {
		return true;
	}

	if (fieldName === 'pregnant') {
		return resolvePregnantFieldDisabledState();
	}

	return false;
}

function handleGenderChange(gender: 'M' | 'F') {
	if (gender === 'F') {
		return;
	}

	formRef.value?.setFieldValue('pregnant', null);
	console.log('handleGenderChange', formRef.value);
}

function handleFieldInput(fieldName: string, fieldValue: any) {
	if (fieldName !== 'gender') return;

	handleGenderChange(fieldValue.value);
}
</script>

<style lang="scss" scoped>
@import '@sysvale/cuida/dist/@sysvale/tokens.scss';

.pregnant {
	&__container {
		padding: pt(9);
		height: 100%;
	}
}

.multifield {
	&__container {
		padding: py(4);
	}
}
</style>
