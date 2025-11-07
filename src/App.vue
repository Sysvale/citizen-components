<template>
	<div>
		<CitizenSelect
			v-model="citizen"
			show-button
		/>

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
const citizen = ref<CitizenSelectModelType>(null);

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
