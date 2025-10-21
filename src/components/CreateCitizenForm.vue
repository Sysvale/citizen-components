<template>
	<div style="width: 400px">
		<Form @submit="handleSubmit">
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
							:state="inputStateResolver(meta)"
							:error-message="errors[0]"
						/>
					</Field>
				</CdsGridItem>

				<CdsGridItem>
					<Field
						v-slot="{ field, errors, meta }"
						name="cns"
						rules="required|minLength:15"
					>
						<CdsTextInput
							v-bind="{ ...field }"
							label="CNS"
							placeholder="000.0000.0000.0000"
							required
							fluid
							mask="###.####.####.####"
							:state="inputStateResolver(meta)"
							:error-message="errors[0]"
						/>
					</Field>
				</CdsGridItem>

				<CdsGridItem>
					<Field
						v-slot="{ field, errors, meta }"
						name="cpf"
						rules="required|minLength:11"
					>
						<CdsTextInput
							v-bind="{ ...field }"
							label="CPF"
							placeholder="000.000.000-00"
							required
							fluid
							mask="###.###.###-##"
							:state="inputStateResolver(meta)"
							:error-message="errors[0]"
						/>
					</Field>
				</CdsGridItem>

				<CdsGridItem>
					<Field
						v-slot="{ field, errors, meta }"
						name="dob"
						rules="required"
					>
						<CdsDateInput
							v-bind="{ ...field }"
							label="Data de nascimento"
							fluid
							:max-date="new Date().toISOString().split('T')[0]"
							:state="inputStateResolver(meta)"
							:error-message="errors[0]"
						/>
					</Field>
				</CdsGridItem>

				<CdsGridItem>
					<Field
						v-slot="{ field, errors, meta }"
						name="sex"
						rules="required"
					>
						<CdsSelect
							v-bind="{ ...field }"
							return-value
							:options="options"
							fluid
							label="Sexo"
							placeholder="Selecione o sexo"
							required
							:state="inputStateResolver(meta)"
							:error-message="errors[0]"
						/>
					</Field>
				</CdsGridItem>
			</CdsGrid>
			<button>Enviar</button>
		</Form>
	</div>
</template>
<script setup lang="ts">
import { Form, Field } from 'vee-validate';
import inputStateResolver from '@/utils/inputStateResolver';

const options = [
	{
		name: 'women',
		value: 'Feminino',
	},
	{
		name: 'men',
		value: 'Masculino',
	},
];

function handleSubmit(v) {
	console.log(v);
}
</script>
