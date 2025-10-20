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
				<TableCell
					:data
					:field
					:row-index
					:col-index
					@edit="emits('edit')"
					@details="emits('details')"
				>
					<template #prepend-action>
						<slot
							name="prepend-action"
							:data
							:field
							:row-index
							:col-index
						/>
					</template>

					<template #append-action>
						<slot
							name="append-action"
							:data
							:field
							:row-index
							:col-index
						/>
					</template>
				</TableCell>
			</template>
		</CdsDataTable>

		<CdsPagination
			v-if="paginationMetaData.lastPage > 1"
			v-model="paginationMetaData.currentPage"
			class="mt-8"
			:per-page="paginationMetaData.perPage"
			:total="paginationMetaData.total"
			:variant="$attrs.variant ?? 'green'"
			fluid
			@update:model-value="fetchCitizens"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import TableCell from './InternalComponents/TableCell.vue';
import { CitizenService } from '../services/citizen/citizen.service';
import { createCustomFields } from '../constants/customFields';
import { createFields } from '../constants/fields';

const model = defineModel<Citizen[]>('modelValue');

const emits = defineEmits(['edit', 'details']);

const citizenService = new CitizenService();
const internalValue = ref<Citizen[]>();
const items = ref<Citizen[]>([]);
const isLoading = ref(false);
const searchString = ref('');
const customFieldsList = ref(createCustomFields());
const fields = ref(createFields());

const paginationMetaData = ref({
	currentPage: 1,
	perPage: 15,
	total: 45,
	lastPage: 3,
});

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

function updateFieldList(newList) {
	fields.value = newList.filter(item => item.visible);
	fields.value = [
		{
			key: 'name',
			label: 'Nome',
		},
		...fields.value,
		{
			key: 'actions',
			label: '',
		},
	];

	fetchCitizens();
}

function handleSearch(term: string) {
	searchString.value = term;
	fetchCitizens();
}
</script>
