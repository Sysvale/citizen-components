<template>
	<div>
		<!-- <pre>{{ citizen }}</pre> -->
		<CitizenSelect
			v-model="citizen"
			show-button
		/>
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

		<!-- <CitizenTable
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
		</CitizenTable> -->
		<CdsButton
			class="mt-7"
			secondary
			@button-click="changeModel"
		>
			Change Model
		</CdsButton>
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

function changeModel() {
	console.log('no change model')
	citizen.value = {
		'id': '05954ccb-188b-4e56-bba8-53211d60e343',
		'name': 'Dr. Monique Orn',
		'gender': 'F',
		'cpf_responsible': null,
		'mother_name': 'Jaime Powlowski DDS',
		'cpf': '56826137918',
		'cns': '440541140933040',
		'birth_date': '1946-10-02',
		'phone': '38 4017-7733',
		'cellphone': '83 7530-1849',
		'email': 'Delta1@hotmail.com',
		'address': {
			'cep': '44443',
			'street': 'Jakubowski Manors',
			'number': '625',
			'complement': 'Suite 152',
			'neighborhood': 'Shanahan Glen',
			'city': 'Albinborough',
			'uf': 'NY'
		},
		'race': 'black',
		'co_cidadao': 2852,
		'is_dead': true,
		'pregnant': false,
		'identification_document': '040516263',
		'issuing_agency': 'SSP'
	}
}
</script>

<style>
body {
	font-family: 'Satoshi', sans-serif;
}
</style>
