<template>
	<div>
		<!-- <CdsGrid
			:cols="2"
			gap="32px"
			class="pa-10 mt-12"
		>
			<div>
				<CitizenSelect
					v-model="citizen"
					show-button
				/>
			</div>
			<div>
				<CitizenSelect
					show-button
					fluid
				/>
			</div>
			<div>
				<CitizenSelect
					show-button
					fluid
				/>
			</div>
		</CdsGrid> -->

		<CitizenTable
			v-model="citizens"
			selection-variant="blue"
			allow-selection
		>
			<template #append-action="slotData">
				<CdsIconButton
					size="sm"
					icon="tag-outline"
					tooltip-text="Adicionar tag"
					@cds-click="logCustomButtonClick(slotData)"
				/>
			</template>
		</CitizenTable>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CitizenSelect from './components/CitizenSelect.vue';
import CitizenTable from './components/CitizenTable.vue';

const citizen = ref<CitizenSelectModelType>(null);
const citizens = ref<Citizen[]>([]);

function logCustomButtonClick({ data, field, colIndex, rowIndex }) {
	console.info('O usuário clicou no botão. metadados: \n');
	console.info('data: ', data);
	console.info('field: ', field);
	console.info('colIndex: ', colIndex);
	console.info('rowIndex: ', rowIndex);
}
</script>

<style>
body {
	font-family: 'Satoshi', sans-serif;
}
</style>
