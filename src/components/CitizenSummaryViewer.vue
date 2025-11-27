<template>
	<div
		class="citizen-resume-viewer"
		:class="{ 'citizen-resume-viewer--limit-width': !fluid }"
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
							size="sm"
							variant="pink"
						>
							Gestante
						</CdsBadge>
					</CdsFlexbox>
					<CdsFlexbox gap="3">
						<CdsIconButton
							size="sm"
							tooltip-text="Editar"
							icon="edit-outline"
							@cds-click="emits('edit')"
						/>
						<CdsIconButton
							size="sm"
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
import { smartTitleCase } from '@sysvale/foundry';
import { Citizen as CitizenModel } from '@/models/Citizen';
import SummarySection from './InternalComponents/SummarySection.vue';

const props = defineProps<{ citizen: Citizen, fluid?: boolean }>();

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
.citizen-resume-viewer {
	&--limit-width {
		width: 800px;
	}
}
</style>
