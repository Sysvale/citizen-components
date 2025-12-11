<template>
	<div
		:class="{ 'summary--limit-width': !fluid }"
	>
		<CdsBox fluid>
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
						v-if="!hideActions"
						gap="3"
					>
						<CdsIconButton
							v-if="!hideEditButton"
							size="sm"
							data-testid="edit-button"
							tooltip-text="Editar"
							icon="edit-outline"
							@cds-click="emits('edit')"
						/>
						<CdsIconButton
							v-if="!hideCloseButton"
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

onMounted(() => fillCitizen(props.citizen));

watch(toRef(props, 'citizen'), (newValue) => fillCitizen(newValue));

function fillCitizen(citizenInfo: any | null) {
	if (!citizenInfo) return;

	internalCitizen.value = new CitizenModel(citizenInfo);
}
</script>

<style lang="scss" scoped>
.summary {
	&--limit-width {
		width: 800px;
	}
}
</style>
