<template>
	<CdsSideSheet
		v-bind="$attrs"
		v-model="model"
		title="Editar usuário SUS"
		size="lg"
		no-close-ok-button
		:disable-ok-button="isLoading || $attrs['disable-ok-button']"
		:disable-cancel-button="isLoading || $attrs['disable-cancel-button']"
		:block-ok-button="true"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<CitizenForm
			ref="editCitizenFormRef"
			v-bind="$attrs"
			:disabled="isLoading"
			:initial-data="selectedCitizen"
		/>
	</CdsSideSheet>
</template>

<script setup lang="ts">
import { ref, inject, watch } from 'vue';
import CitizenForm from './InternalComponents/CitizenForm.vue';
import { Citizen } from '@/models/Citizen';
import { CitizenService } from '@/services/citizen/citizen.service'; 
import type { UpdateCitizenParams } from '@/services/citizen/citizen.types';

const emits = defineEmits(['success']);

const model = defineModel<boolean>({
	default: false
});

const useToast = inject('useToast');

const props = withDefaults(
	defineProps<{
		toastSuccessDescription?: string;
		toastErrorDescription?: string;
		citizen: string;
	}>(),
	{
		toastSuccessDescription: 'Cidadão atualizado com sucesso.',
		toastErrorDescription: 'Houve um erro ao salvar as informações do cidadão.',
	}
);

const editCitizenFormRef = ref<InstanceType<typeof CitizenForm> | null>(null);
const citizenService = new CitizenService();
const isLoading = ref<boolean>(false);
const selectedCitizen = ref<object | null | undefined>(null);

watch(model, (newValue) => {
	if (!newValue) return;

	fetchCitizen();
});

async function fetchCitizen() {
	isLoading.value = true;
	citizenService.read({ search_string: props.citizen })
		.then(({ data }) => {
			if (data.length === 0) {
				return;
			}

			[selectedCitizen.value] = data;
		})
		.finally(() => isLoading.value = false);
}

async function updateCitizen(formData: UpdateCitizenParams) {
	if (!formData.id) {
		console.error('ID do cidadão não informado, por favor, verifique os dados do formulário.');
		return;
	}

	citizenService.update(formData)
		.then(({ data }) => {
			emits('success', data.citizen);
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
		})
		.catch(() => {
			// @ts-ignore
			useToast().fire({
				title: 'Erro ao salvar informações',
				description: props.toastErrorDescription,
				dismissible: true,
				dismissAfter: 6000,
				autoDismissible: true,
				variant: 'danger',
				light: false,
			});
		})
		.finally(() => {
			isLoading.value = false;
			model.value = false;
		});
}

function handleOk() {
	isLoading.value = true;

	editCitizenFormRef.value?.validate()
		.then((values) => {
			updateCitizen(new Citizen(values).asRequestPayload() as UpdateCitizenParams);
		})
		.catch((error) => {
			isLoading.value = false;
			if (error.message === 'validation') {
				return;
			}

			// @ts-ignore
			useToast().fire({
				title: 'Erro',
				description: error,
				dismissible: true,
				dismissAfter: 6000,
				autoDismissible: true,
				variant: 'danger',
				light: false,
			});
		});
}

function handleCancel() {
	editCitizenFormRef.value?.resetForm();
}
</script>

<style lang="scss" scoped>
</style>
