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
		<template #default>
			<Form ref="formRef">
				<CdsGrid
					:cols="6"
					col-gap="2"
					row-gap="4"
				>
					<CdsGridItem :col-span="6">
						<Field
							v-slot="{ field, errors, meta }"
							name="name"
							label="nome"
							rules="required|min:5"
						>
							<CdsTextInput
								v-bind="field"
								v-model="field.value"
								label="Nome"
								placeholder="Nome do usuário"
								required
								fluid
								:disabled="isLoading"
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem :col-span="3">
						<Field
							v-slot="{ field, errors, meta }"
							name="cns"
							label="CNS"
							rules="required|cns"
						>
							<CdsTextInput
								v-bind="field"
								v-model="field.value"
								label="CNS"
								placeholder="000 0000 0000 0000"
								mask="### #### #### ####"
								required
								fluid
								:disabled="isLoading"
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem :col-span="3">
						<Field
							v-slot="{ field, errors, meta }"
							name="cpf"
							label="CPF"
							rules="required|cpf"
						>
							<CdsTextInput
								v-bind="field"
								v-model="field.value"
								label="CPF"
								placeholder="000.000.000-00"
								required
								fluid
								:disabled="isLoading"
								mask="###.###.###-##"
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem :col-span="3">
						<Field
							v-slot="{ field, errors, meta }"
							name="birthDate"
							label="data de nascimento"
							rules="required"
						>
							<CdsDateInput
								v-bind="field"
								v-model="field.value"
								label="Data de nascimento"
								required
								fluid
								:variant="$attrs['action-button-variant']"
								:disabled="isLoading"
								:max-date="computedMaxDate"
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem :col-span="3">
						<Field
							v-slot="{ field, errors, meta }"
							name="rg"
							label="RG"
							rules="required"
						>
							<CdsTextInput
								v-bind="field"
								v-model="field.value"
								label="RG"
								placeholder="Número do RG"
								required
								fluid
								:disabled="isLoading"
								mask="###########"
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem
						v-if="withRace"
						:col-span="2"
					>
						<Field
							v-slot="{ field, errors, meta }"
							name="race"
							label="raça/cor"
							rules="required"
						>
							<CdsSelect
								v-bind="field"
								v-model="field.value"
								options-field="name"
								:options="races"
								fluid
								:disabled="isLoading"
								label="Raça/cor"
								placeholder="Selecione a raça/cor"
								required
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem
						:col-span="withRace ? 2 : 3"
					>
						<Field
							v-slot="{ field, errors, meta }"
							name="gender"
							label="sexo"
							rules="required"
						>
							<CdsSelect
								v-bind="field"
								v-model="field.value"
								options-field="name"
								:options="genders()"
								fluid
								:disabled="isLoading"
								label="Sexo"
								placeholder="Selecione o sexo"
								required
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
								@update:model-value="handleGenderChange"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem :col-span="2">
						<Field
							v-slot="{ field }"
							name="pregnant"
							label="gestante"
							as="div"
							class="pregnant__container"
						>
							<CdsCheckbox
								v-bind="field"
								v-model="field.value"
								label="Está gestante"
								variant="green"
								:disabled="isLoading || disablePregnantField"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem :col-span="3">
						<Field
							v-slot="{ field, errors, meta }"
							name="phone"
							label="telefone"
							rules="required"
						>
							<CdsTextInput
								v-bind="field"
								v-model="field.value"
								label="Telefone"
								placeholder="(00) 00000-0000"
								required
								fluid
								:disabled="isLoading"
								mask="(##) # ####-####"
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem :col-span="3">
						<Field
							v-slot="{ field, errors, meta }"
							name="email"
							label="e-mail"
							rules="required|email"
						>
							<CdsTextInput
								v-bind="field"
								v-model="field.value"
								label="E-mail"
								placeholder="seu.email@exemplo.com"
								required
								fluid
								:disabled="isLoading"
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem :col-span="4">
						<Field
							v-slot="{ field, errors, meta }"
							name="street"
							label="rua"
							rules="required"
						>
							<CdsTextInput
								v-bind="field"
								v-model="field.value"
								label="Rua"
								placeholder="Ex.: Rua Coronel Exemplio Lima"
								required
								fluid
								:disabled="isLoading"
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem :col-span="2">
						<Field
							v-slot="{ field, errors, meta }"
							name="number"
							label="número"
							rules="required"
						>
							<CdsTextInput
								v-bind="field"
								v-model="field.value"
								label="Número"
								placeholder="00"
								required
								fluid
								:disabled="isLoading"
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem :col-span="3">
						<Field
							v-slot="{ field }"
							name="complement"
							label="complemento"
						>
							<CdsTextInput
								v-bind="field"
								v-model="field.value"
								label="Complemento"
								placeholder="Ex.: Casa, prédio..."
								fluid
								:disabled="isLoading"
							/>
						</Field>
					</CdsGridItem>
					<CdsGridItem :col-span="3">
						<Field
							v-slot="{ field, errors, meta }"
							name="neighborhood"
							label="bairro"
							rules="required"
						>
							<CdsTextInput
								v-bind="field"
								v-model="field.value"
								label="Bairro"
								placeholder="Ex.: Centro"
								required
								fluid
								:disabled="isLoading"
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>
					<CdsToast
						variant="green"
						size="md"
						text="Lorem Ipsum"
					/>
				</CdsGrid>
			</Form>
		</template>
	</CdsSideSheet>
</template>
<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { Form, Field, type FormContext } from 'vee-validate';
import inputStateResolver from '@/utils/inputStateResolver';
import { genders } from '@/constants/genders';
import { races } from '@/constants/races';
import { CitizenService } from '@/services/citizen/citizen.service';
import { Citizen } from '@/models/Citizen';
import type { Gender } from '@/types';

const useToast = inject('useToast');

const props = withDefaults(
	defineProps<{
		toastSuccessDescription?: string;
		toastErrorDescription?: string;
		withRace?: boolean;
	}>(),
	{
		toastSuccessDescription: 'Cidadão cadastrado com sucesso.',
		toastErrorDescription: 'Houve um erro ao cadastrar o cidadão.',
		withRace: false,
	}
);

const emits = defineEmits(['success']);

const model = defineModel<boolean>();
const formRef = ref<FormContext | null>(null);
const isLoading = ref(false);
const citizenService = new CitizenService();

const computedMaxDate = computed(() => {
	return new Date().toISOString().split('T')[0];
});

const disablePregnantField = computed(() => {
	if (!formRef.value) return false;

	return formRef.value?.values.gender?.value !== 'F';
});

async function handleOk() {
	let formValidationResult;

	if (!formRef.value) return;

	try {
		formValidationResult = await formRef.value.validate();
	} catch (error) {
		console.error(error);
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

function handleGenderChange(gender: Gender) {
	if (gender.value === 'F') {
		return;
	}

	formRef.value?.setFieldValue('pregnant', null);
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
