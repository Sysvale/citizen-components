<template>
	<CdsSideSheet
		v-bind="$attrs"
		v-model="model"
		title="Cadastrar usuário SUS"
		no-close-ok-button
		:disable-ok-button="isLoading || $attrs['disable-ok-button']"
		:disable-cancel-button="isLoading || $attrs['disable-cancel-button']"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<template #default>
			<Form ref="formRef">
				<CdsGrid
					:cols="2"
					gap="20px"
				>
					<CdsGridItem :col-span="2">
						<Field
							v-slot="{ field, errors, meta }"
							name="name"
							label="nome"
							rules="required|minLength:5"
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

					<CdsGridItem>
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

					<CdsGridItem>
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

					<CdsGridItem>
						<Field
							v-slot="{ field, errors, meta }"
							name="birth_date"
							label="data de nascimento"
							rules="required"
						>
							<CdsDateInput
								v-bind="field"
								v-model="field.value"
								label="Data de nascimento"
								fluid
								:variant="$attrs['action-button-variant']"
								:disabled="isLoading"
								:max-date="computedMaxDate"
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>

					<CdsGridItem>
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
import { CitizenService } from '@/services/citizen/citizen.service';
import { Citizen } from '@/models/Citizen';

const useToast = inject('useToast');

const emits = defineEmits(['created-citizen']);

const model = defineModel<boolean>();
const formRef = ref<FormContext | null>(null);
const isLoading = ref(false);

const computedMaxDate = computed(() => {
	return new Date().toISOString().split('T')[0];
});

const citizenService = new CitizenService();

async function handleOk() {
	let formValidationResult;

	if (!formRef.value) return;

	try {
		formValidationResult = await formRef.value.validate();
	} catch (error) {
		console.log('🚀 -> error:', error);
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
			description:
				'Cidadão criado com sucesso.',
			dismissible: true,
			dismissAfter: 6000,
			autoDismissible: true,
			variant: 'success',
			light: false,
		});
		emits('created-citizen', citizen);
	} catch (error) {
		let errorMessage;

		console.error('Error creating citizen:', error);
		if (error instanceof Error) {
			errorMessage =
				error.message === ''
					? 'Houve um erro ao realizar o cadastro do usuário, por favor tente novamente.'
					: error.message;
		}

		useToast().fire({
			title: 'Erro ao cadastrar usuário',
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
</script>
