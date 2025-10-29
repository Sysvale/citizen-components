<template>
	<CdsSideSheet
		v-model="internalShowSidesheet"
		title="Cadastrar usuário SUS"
		with-overlay
		no-close-ok-button
		:action-button-variant="actionButtonVariant"
		:size
		:ok-button-text="okButtonText"
		:cancel-button-text="cancelButtonText"
		:disable-ok-button="isLoading"
		:disable-cancel-button="isLoading"
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
							rules="required|cns"
						>
							<CdsTextInput
								v-bind="{ ...field }"
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
							rules="required|cpf"
						>
							<CdsTextInput
								v-bind="{ ...field }"
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
							rules="required"
						>
							<CdsDateInput
								v-bind="{ ...field }"
								v-model="field.value"
								label="Data de nascimento"
								fluid
								:disabled="isLoading"
								:max-date="new Date().toISOString().split('T')[0]"
								:state="inputStateResolver(meta)"
								:error-message="errors[0]"
							/>
						</Field>
					</CdsGridItem>

					<CdsGridItem>
						<Field
							v-slot="{ field, errors, meta }"
							name="gender"
							rules="required"
						>
							<CdsSelect
								v-bind="{ ...field }"
								v-model="field.value"
								options-field="name"
								:options="genders"
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
				</CdsGrid>
			</Form>
		</template>
	</CdsSideSheet>
</template>
<script setup lang="ts">
import { ref, defineModel } from 'vue';
import { Form, Field, type FormContext } from 'vee-validate';
import inputStateResolver from '@/utils/inputStateResolver';
import { genders } from '@/constants/genders';
import { CitizenService } from '@/services/citizen/citizen.service';
import { Citizen } from '@/models/Citizen';

defineProps({
	okButtonText: {
		type: String,
		default: 'Criar',
	},
	cancelButtonText: {
		type: String,
		default: 'Cancelar',
	},
	actionButtonVariant: {
		type: String,
		default: 'green',
	},
	size: {
		type: String,
		default: 'md',
	},
});

const formRef = ref<FormContext | null>(null);
const isLoading = ref(false);

const internalShowSidesheet = defineModel({
	type: Boolean,
	default: false,
});

const emit = defineEmits(['success', 'error']);

const citizenService = new CitizenService();

async function handleOk() {
	if (!formRef.value) {
		return;
	}

	const result = await formRef.value.validate();

	if (!result.valid) {
		return;
	}

	try {
		isLoading.value = true;
		const citizen = await citizenService.create(
			new Citizen(formRef.value.values).asRequestPayload()
		);

		formRef.value.resetForm();
		internalShowSidesheet.value = false;

		emit('success', citizen);
	} catch (error) {
		console.error('Error creating citizen:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		emit('error', errorMessage);
	} finally {
		isLoading.value = false;
	}
}

function handleCancel() {
	formRef.value?.resetForm();
}
</script>
