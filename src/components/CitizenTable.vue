<template>
	<div>
		<CdsDataTable
			v-bind="{ ...$attrs }"
			v-model="internalValue"
			:fields
			:items
			:custom-fields-list
			:loading="isLoading"
			:total-items="paginationMetaData.total"
			with-search-button
			with-search
			custom-fields-searchable
			custom-fields-track-by="key"
			@update-fields-list="updateFieldList"
			@search-button-click="handleSearch"
		>
			<template #table-item="{ data, field, colIndex, rowIndex }">
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
					v-if="field === 'address'"
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

				<template v-if="typeof data[field] === 'boolean'">
					{{ formatBoolean(data[field]) }}
				</template>

				<template v-if="field === 'gender'">
					{{ genderFormatter(data[field]) }}
				</template>

				<template v-if="field === 'race'">
					{{ raceFormatter(data[field]) }}
				</template>

				<template v-if="field === 'actions'">
					<CdsFlexbox
						gap="2"
						justify="end"
					>
						<slot
							name="prepend-action"
							:data
							:field
							:row-index
							:col-index
						/>

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

						<slot
							name="append-action"
							:data
							:field
							:row-index
							:col-index
						/>
					</CdsFlexbox>
				</template>

				<template v-else-if="data[field] !== false && !data[field]">
					--
				</template>
			</template>
		</CdsDataTable>

		<CdsPagination
			v-if="paginationMetaData.lastPage > 1"
			v-model="paginationMetaData.currentPage"
			:per-page="paginationMetaData.perPage"
			:total="paginationMetaData.total"
			class="mt-8"
			:variant="$attrs.variant ?? 'green'"
			fluid
			@update:model-value="fetchCitizens"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { maskCpf, maskCns } from '@sysvale/foundry';
import { CitizenService } from '../services/citizen/citizen.service';

const model = defineModel<Citizen[]>('modelValue');

const emits = defineEmits(['edit', 'details']);

const citizenService = new CitizenService();
const internalValue = ref<Citizen[]>();
const items = ref<Citizen[]>([]);
const isLoading = ref(false);
const searchString = ref('');

const paginationMetaData = ref({
	currentPage: 1,
	perPage: 15,
	total: 45,
	lastPage: 3,
});

const fields = ref([
	{
		key: 'name',
		label: 'Nome',
	},
	{
		key: 'birth_date',
		label: 'Data de nascimento',
		formatter: (date: string) => dmyFormatter(date),
	},
	{
		key: 'address',
		label: 'Endereço',
	},
	{
		key: 'actions',
		label: '',
	},
]);

const customFieldsList = ref([
	{
		key: 'birth_date',
		label: 'Data de nascimento',
		formatter: (date: string) => dmyFormatter(date),
	},
	{
		key: 'address',
		label: 'Endereço',
	},
	{
		key: 'gender',
		label: 'Sexo',
		visible: false,
	},
	{
		key: 'identification_document',
		label: 'RG',
		visible: false,
	},
	{
		key: 'phone',
		label: 'Telefone',
		visible: false,
	},
	{
		key: 'cellphone',
		label: 'Celular',
		visible: false,
	},
	{
		key: 'race',
		label: 'Raça',
		visible: false,
	},
	{
		key: 'mother_name',
		label: 'Nome da mãe',
		visible: false,
	},
	{
		key: 'cpf_responsible',
		label: 'CPF do responsável',
		visible: false,
	},
	{
		key: 'email',
		label: 'Email',
		visible: false,
	},
]);

const payload = computed(() => ({
	page: paginationMetaData.value.currentPage,
	perPage: paginationMetaData.value.perPage,
	fields: sanitizedFields.value,
	searchString: searchString.value,
}));

const sanitizedFields = computed(() =>
	fields.value
		.filter(field => field.key !== 'actions')
		.map(field => field.key)
);

watch(internalValue, value => (model.value = value));

onMounted(async () => fetchCitizens());

async function fetchCitizens() {
	isLoading.value = true;
	try {
		const response = await citizenService.index(payload.value);
		items.value = response.data;
		paginationMetaData.value = {
			currentPage: response.meta.current_page,
			perPage: response.meta.per_page,
			total: response.meta.total,
			lastPage: response.meta.last_page,
		};
	} catch (error: unknown) {
		console.error('Error fetching citizens:', error);
	} finally {
		isLoading.value = false;
	}
}

function dmyFormatter(date: string) {
	const [year, month, day] = date.split('-').map(Number);

	if (!year || !month || !day) {
		return '--';
	}

	return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
}

function formatBoolean(isTrue: boolean) {
	return isTrue ? 'Sim' : 'Não';
}

function updateFieldList(newList) {
	fields.value = newList.filter(item => item.visible);
	fields.value = [
		{
			key: 'name',
			label: 'Nome',
		},
		...fields.value,
	];

	fetchCitizens();
}

function handleSearch(term: string) {
	searchString.value = term;
	fetchCitizens();
}

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
