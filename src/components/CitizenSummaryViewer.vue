<template>
	<div
		:class="{ 'summary--limit-width': !fluid }"
	>
		<CdsBox fluid>
			<CdsFlexbox
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
							{{ smartTitleCase(citizen.name) }}
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
					:items="internalCitizen.personalInfo"
				/>
				<SummarySection
					v-if="internalCitizen"
					title="Informações de contato"
					:items="internalCitizen?.contactInfo"
				/>
			</CdsFlexbox>
		</CdsBox>
	</div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';
// @ts-ignore
import { smartTitleCase } from '@sysvale/foundry';
import { Citizen as CitizenModel } from '@/models/Citizen';
import SummarySection from './InternalComponents/SummarySection.vue';

const props = withDefaults(defineProps<{
	citizen: Partial<Citizen>,
	fluid?: boolean,
	hideEditButton?: boolean,
	hideCloseButton?: boolean,
	hideActions?: boolean,
}>(),
{
	hideEditButton: false,
	hideCloseButton: false,
	hideActions: false
});

const emits = defineEmits(['edit', 'close']);

const internalCitizen = ref<CitizenModel>();

onMounted(() => {
	internalCitizen.value = new CitizenModel(props.citizen);
});

watch(props.citizen, (newValue) => {
	internalCitizen.value = new CitizenModel(newValue);
})
</script>

<style lang="scss" scoped>
.summary {
	&--limit-width {
		width: 800px;
	}
}
</style>
