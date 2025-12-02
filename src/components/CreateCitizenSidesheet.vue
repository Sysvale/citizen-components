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
		<CitizenForm
			ref="citizenFormRef"
			v-bind="$attrs"
			:disabled="isLoading"
		/>
	</CdsSideSheet>
</template>
<script setup lang="ts">
import { inject, ref } from 'vue';
import CitizenForm from './InternalComponents/CitizenForm.vue';
import { CitizenService } from '@/services/citizen/citizen.service';
import { Citizen } from '@/models/Citizen';

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
const citizenFormRef = ref<InstanceType<typeof CitizenForm> | null>(null);
const isLoading = ref(false);
const citizenService = new CitizenService();

async function saveCitizen(formData: object) {
	try {
		isLoading.value = true;
		const citizen = await citizenService.create(
			new Citizen(formData).asRequestPayload()
		);

		citizenFormRef.value?.resetForm();
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
	}
}

function handleOk() {
	citizenFormRef.value?.validate() 
		.then((values: any) => {
			isLoading.value = true;
			saveCitizen(values);
		})
		.catch((error) => {
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
	citizenFormRef.value?.resetForm();
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
