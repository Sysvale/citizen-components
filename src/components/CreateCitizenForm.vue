<template>
	<div style="width: 400px">
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
							v-bind="{ ...field }"
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
	</div>
</template>
<script setup lang="ts">
import { ref, type VNodeRef } from 'vue';
import { Form, Field } from 'vee-validate';
import inputStateResolver from '@/utils/inputStateResolver';
import { genders } from '@/constants/genders';
import { CitizenService } from '@/services/citizen/citizen.service';
import { Citizen } from '@/models/Citizen';

const formRef = ref<VNodeRef | null>(null);
const isLoading = ref(false);
const citizenService = new CitizenService();

async function createUser() {
	formRef.value.validate().then(async (result: any) => {
		if (result.valid) {
			try {
				isLoading.value = true;
				const citizen = await citizenService.create(
					new Citizen(formRef.value.getValues()).asRequestPayload()
				);

				console.info('🚀 -> citizen:', citizen);
			} catch (error) {
				console.error('Error fetching citizens:', error);

				const errorMessage =
					error instanceof Error ? error.message : 'Unknown error';

				throw new Error(`Error fetching citizens: ${errorMessage}`);
			} finally {
				isLoading.value = false;
			}
		}
	});
}

defineExpose({
	create: () => createUser(),
	isLoading,
});
</script>
