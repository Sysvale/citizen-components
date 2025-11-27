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
							v-if="isPregnant"
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
						/>

						<CdsIconButton
							size="sm"
							tooltip-text="Fechar"
							icon="x-outline"
						/>
					</CdsFlexbox>
				</CdsFlexbox>

				<ResumeSection
					title="Dados pessoais"
					:items="personalInfoSectionItems"
				/>

				<ResumeSection
					title="Informações de contato"
					:items="contactInfoSectionItems"
				/>
			</CdsFlexbox>
		</CdsBox>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { maskCpf, maskCns, maskPhone, smartTitleCase } from '@sysvale/foundry';
import { DateTime } from 'luxon';
import { genderFromType } from '@/constants/genders';
import ResumeSection from './InternalComponents/ResumeSection.vue';

const props = defineProps<{ citizen: Citizen, fluid?: boolean }>();

const isPregnant = computed(() => {
	return props.citizen.pregnant;
});

const personalInfoSectionItems = computed(() => {
	return [
		{ label: 'CPF', value: maskCpf(props.citizen.cpf) ?? '--' },
		{ label: 'CNS', value: maskCns(props.citizen.cns) ?? '--' },
		{ label: 'RG', value: props.citizen.identification_document ?? '--' },
		{ label: 'Nascimento', value: DateTime.fromISO(props.citizen.birth_date).toFormat('dd/MM/yyyy') },
		{ label: 'Sexo', value: genderFromType(props.citizen.gender)?.name ?? '--' },
		{ label: 'Raça/Cor', value: props.citizen.race ?? '--' },
	];
});

const contactInfoSectionItems = computed(() => {
	return [
		{ label: 'Telefone', value: maskPhone(props.citizen.phone) ?? '--' },
		{ label: 'Celular', value: maskPhone(props.citizen.cellphone) ?? '--' },
		{ label: 'E-mail', value: props.citizen.email ?? '--' },
		{ label: 'Endereço', value: getFancyAddress(), fill: true },
	];
});

function getFancyAddress() {
	const address = props.citizen.address

	if (!address) {
		return '--'
	}

	return `${address.street},
		${address.number},
		${address.neighborhood},
		${address.city} - ${address.uf}`
}
</script>

<style lang="scss" scoped>
.citizen-resume-viewer {
	&--limit-width {
		width: 800px;
	}
}
</style>
