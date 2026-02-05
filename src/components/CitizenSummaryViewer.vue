<template>
	<div
		:class="{ 'summary--limit-width': !fluid }"
	>
		<CdsBox
			:variant="hasMissingFields ? 'amber' : 'gray'"
			fluid
		>
			<CdsSpacer
				v-if="!citizen"
			>
				<CdsEmptyState
					:hide-action-button="hideCreateButton"
					title="Nenhum cidadão selecionado"
					text="Ao selecionar um cidadão, suas informações serão exibidas aqui."
					action-button-text="Adicionar novo cidadão"
					@action-button-click="emits('create')"
				>
					<template #graphic-element>
						<CdsImage
							:src="emptyStateImage"
							alt="Imagem de empty state"
							height="150"
						/>
					</template>
				</CdsEmptyState>
			</CdsSpacer>
			<CdsFlexbox
				v-else
				gap="6"
				direction="column"
			>
				<CdsFlexbox
					justify="space-between"
				>
					<CdsFlexbox
						gap="3"
						align="center"
					>
						<CdsText
							as="subheading-2"
							no-margin
							font-weight="semibold"
							color="n-700"
						>
							{{ smartTitleCase(citizen?.name) }}
						</CdsText>
						<CdsBadge
							v-if="internalCitizen?.isPregnant"
							data-testid="pregnant-badge"
							size="sm"
							variant="pink"
						>
							Gestante
						</CdsBadge>
					</CdsFlexbox>
					<CdsFlexbox
						gap="3"
					>
						<CdsFlexbox
							v-if="hasMissingFields"
							align="center"
							data-testid="missing-fields-alert"
							gap="1"
						>
							<CdsIcon
								height="24"
								width="24"
								name="warning-outline"
								color="#EDA831"
							/>
							<CdsText
								as="caption"
								font-weight="semibold"
								style="color: #EDA831"
							>
								Cadastro incompleto
							</CdsText>
						</CdsFlexbox>
						<CdsIconButton
							v-if="!hideEditButton && !hideActions"
							size="sm"
							data-testid="edit-button"
							tooltip-text="Editar"
							icon="edit-outline"
							@cds-click="emits('edit')"
						/>
						<CdsIconButton
							v-if="!hideCloseButton && !hideActions"
							size="sm"
							data-testid="close-button"
							tooltip-text="Fechar"
							icon="x-outline"
							@cds-click="emits('close')"
						/>
					</CdsFlexbox>
				</CdsFlexbox>
				<SummarySection
					v-if="internalCitizen"
					title="Dados pessoais"
					:items="internalCitizen.getPersonalInfo(hiddenFields)"
				/>
				<SummarySection
					v-if="internalCitizen"
					title="Informações de contato"
					:items="internalCitizen?.getContactInfo(hiddenFields)"
				/>
			</CdsFlexbox>
		</CdsBox>
	</div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, toRef } from 'vue';
import { isEmpty, isNil, isObject, isString } from 'lodash';
// @ts-ignore
import { smartTitleCase } from '@sysvale/foundry';
import { Citizen as CitizenModel } from '@/models/Citizen';
import { type Citizen } from '@/types';
import emptyState from '../assets/images/summary-empty-state.svg';
import SummarySection from './InternalComponents/SummarySection.vue';

const props = withDefaults(defineProps<{
	citizen?: Partial<Citizen> | null,
	fluid?: boolean,
	hideEditButton?: boolean,
	hideCloseButton?: boolean,
	hideActions?: boolean,
	hideCreateButton?: boolean,
	hiddenFields?: string[],
}>(),
{
	citizen: null,
	hideEditButton: false,
	hideCloseButton: false,
	hideActions: false,
	hiddenFields: () => [],
});

const emits = defineEmits(['create', 'edit', 'close']);

const internalCitizen = ref<CitizenModel>();
const emptyStateImage = emptyState;
const hasMissingFields = ref(false);

onMounted(() => {
	checkMissingRequiredFields(props.citizen);
	fillCitizen(props.citizen);
});

watch(toRef(props, 'citizen'), (newValue) => {
	checkMissingRequiredFields(newValue);
	fillCitizen(newValue);
});

function fillCitizen(citizenInfo: any | null) {
	if (!citizenInfo) return;

	internalCitizen.value = new CitizenModel(citizenInfo);
}

function checkMissingRequiredFields(value: Partial<Citizen> | null) {
	if (!value) {
		hasMissingFields.value = false;
		return;
	}

	const citizen = value as Record<string, unknown>;
	const genderValue = citizen['gender'] ?? citizen['_gender'];
	const addressValue = citizen['address'] ?? citizen['_address'];
	const addressSource = (addressValue as Record<string, unknown>) ?? {
		street: citizen['street'],
		number: citizen['number'],
		neighborhood: citizen['neighborhood'],
		city: citizen['city'],
		uf: citizen['uf'],
	};

	const missingCpfAndCnsFields = ['cpf', 'cns'].some(field => isEmptyValue(citizen[field]));

	const missingCitizenFields = ['name', 'birth_date', 'mother_name', 'race'].some(field =>
		isEmptyValue(citizen[field])
	) || isEmptyValue(genderValue);

	const missingAddressFields = ['street', 'number', 'neighborhood', 'city', 'uf'].some(
		field => isEmptyValue(addressSource?.[field])
	);

	hasMissingFields.value = missingCitizenFields || missingAddressFields || missingCpfAndCnsFields;
}

function isEmptyValue(value: unknown) {
	if (isNil(value)) return true;
	if (isString(value)) return value.trim() === '';
	if (!isObject(value)) return false;

	const obj = value as Record<string, unknown>;
	if ('value' in obj) return isEmptyValue(obj.value);
	if ('name' in obj) return isEmptyValue(obj.name);
	if ('shortName' in obj) return isEmptyValue(obj.shortName);
	if ('id' in obj) return isEmptyValue(obj.id);

	return isEmpty(obj);
}

defineExpose({
	hasMissingFields,
})
</script>

<style lang="scss" scoped>
.summary {
	&--limit-width {
		width: 800px;
	}
}
</style>
