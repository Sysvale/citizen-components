<template>
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
						:data-testid="`test-${formField.name}`"
						:disabled="resolveDisabledState(formField.name)"
						:state="inputStateResolver(meta)"
						:error-message="errors[0]"
						@update:model-value="(event: any) => handleFieldInput(formField.name, event)"
					/>
				</Field>
			</CdsGridItem>
		</CdsGrid>
	</Form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Form, Field, type FormContext } from 'vee-validate';
import inputStateResolver from '@/utils/inputStateResolver';
import citizenFormFields from '@/constants/citizenFormFields';

const props = withDefaults(
	defineProps<{
		disabledFields?: string[] | 'all';
		initialState?: object;
		hiddenFields?: string[];
		disabled?: boolean;
	}>(),
	{
		initialState: () => ({}),
		disabledFields: () => ([]),
		hiddenFields: () => ([]),
		disabled: false,
	}
);

const formRef = ref<FormContext | null>(null);

const formFields = computed(() => citizenFormFields(props.hiddenFields));

function resolvePregnantFieldDisabledState() {
	if (!formRef.value) return false;

	return formRef.value?.values.gender?.value !== 'F';
}

function resolveDisabledState(fieldName: string) {
	if (props.disabled || props.disabledFields.includes(fieldName) || props.disabledFields === 'all') {
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
}

function handleFieldInput(fieldName: string, fieldValue: any) {
	if (fieldName !== 'gender') return;

	handleGenderChange(fieldValue.value);
}

defineExpose({
	validate: () => new Promise((resolve, reject) => {
		formRef.value?.validate()
			.then(({ valid }) => {
				if (!valid) {
					reject(new Error('validation'));
					return;
				}

				resolve(formRef.value?.values);
			})
			.catch(reject);
	}),
	resetForm: () => formRef.value?.resetForm(),
});
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
