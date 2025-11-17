<template>
	<div>
		<CdsFlexbox
			v-if="field === 'name'"
			direction="column"
			gap="1"
		>
			<CdsText
				no-margin
				as="subheading-3"
				font-weight="semibold"
			>
				{{ data.name }}
			</CdsText>
			<div class="mt-1">
				<CdsText
					font-weight="semibold"
					as="caption"
				>
					CPF:
				</CdsText>
				<CdsText
					as="caption"
				>
					{{ cpfResolver(data.cpf) }}
				</CdsText>
			</div>
			<div>
				<CdsText
					font-weight="semibold"
					as="caption"
				>
					CNS:
				</CdsText>
				<CdsText as="caption">
					{{ cnsResolver(data.cns) }}
				</CdsText>
			</div>
		</CdsFlexbox>

		<CdsFlexbox
			v-else-if="field === 'address'"
			direction="column"
			gap="1"
		>
			<template
				v-if="Object.keys(data.address).length"
			>
				<CdsText
					v-if="data.address.street"
					as="caption"
				>
					{{ data.address.street }}, Nº {{ data.address.number ?? '--' }}
				</CdsText>

				<CdsText
					v-if="data.address.neighborhood"
					as="caption"
				>
					{{ data.address.neighborhood }}
				</CdsText>

				<CdsText
					v-if="data.address.city && data.address.uf"
					as="caption"
				>
					{{ data.address.city }} / {{ data.address.uf }}
				</CdsText>
			</template>

			<CdsText
				v-else
				as="caption"
			>
				--
			</CdsText>
		</CdsFlexbox>

		<template v-else-if="field === 'gender'">
			{{ genderFormatter(data[field]) }}
		</template>

		<template v-else-if="field === 'race'">
			{{ raceFormatter(data[field]) }}
		</template>

		<template v-else-if="field === 'birth_date'">
			{{ dmyFormatter(data[field]) }}
		</template>

		<template v-else-if="field === 'actions'">
			<CdsFlexbox
				gap="2"
				justify="end"
			>
				<slot name="prepend-action" />

				<CdsIconButton
					v-if="!hideDetailsIcon"
					size="sm"
					icon="document-text-outline"
					tooltip-text="Ver detalhes"
					@cds-click="emits('details')"
				/>

				<CdsIconButton
					v-if="!hideEditIcon"
					size="sm"
					icon="edit-outline"
					tooltip-text="Editar"
					@cds-click="emits('edit')"
				/>

				<slot name="append-action" />
			</CdsFlexbox>
		</template>

		<template v-else>
			--
		</template>
	</div>
</template>

<script setup lang="ts">
import { maskCpf, maskCns } from '@sysvale/foundry';
import { dmyFormatter } from '@/utils/dmyFormatter';

defineProps<{
	data: Citizen;
	field: keyof Citizen | 'actions';
	rowIndex: number;
	colIndex: number;
	hideEditIcon?: boolean;
	hideDetailsIcon?: boolean;
}>();

const emits = defineEmits(['edit', 'details']);

function genderFormatter(gender: string) {
	return gender === 'F' ? 'Feminino' : 'Masculino';
}

function raceFormatter(race: string) {
	switch (race) {
		case 'white':
			return 'Branca';
		case 'black':
			return 'Preta';
		case 'brown':
			return 'Parda';
		case 'indigenous':
			return 'Indígena';
		case 'yellow':
			return 'Amarela';
		default:
			return '--';
	}
}

function cpfResolver(cpf: string | null) {
	return cpf ? maskCpf(cpf) : '--';
}

function cnsResolver(cns: string | null) {
	return cns ? maskCns(cns) : '--';
}
</script>
