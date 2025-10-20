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
				<CdsText as="caption">
					{{ maskCpf(data.cpf) }}
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
					{{ maskCns(data.cns) }}
				</CdsText>
			</div>
		</CdsFlexbox>

		<CdsFlexbox
			v-else-if="field === 'address'"
			direction="column"
			gap="1"
		>
			<CdsText as="caption">
				{{ data.address.street }}, Nº {{ data.address.number }}
			</CdsText>

			<CdsText as="caption">
				{{ data.address.neighborhood }}
			</CdsText>

			<CdsText as="caption">
				{{ data.address.city }} / {{ data.address.uf }}
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
					size="sm"
					icon="document-text-outline"
					tooltip-text="Ver detalhes"
					@cds-click="emits('details')"
				/>

				<CdsIconButton
					size="sm"
					icon="edit-outline"
					tooltip-text="Editar"
					@cds-click="emits('edit')"
				/>

				<slot name="append-action" />
			</CdsFlexbox>
		</template>

		<template v-else> -- </template>
	</div>
</template>

<script setup lang="ts">
import { maskCpf, maskCns } from '@sysvale/foundry';
import { dmyFormatter } from '../../utils/dmyFormatter';

defineProps<{
	data: Citizen;
	field: keyof Citizen | 'actions';
	rowIndex: number;
	colIndex: number;
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
</script>
