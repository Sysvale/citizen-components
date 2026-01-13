<template>
	<div>
		<CitizenSelect
			v-model="citizen"
			show-button
			disabled
		/>

		<CdsButton
			class="mt-7"
			secondary
			@button-click="changeModel"
		>
			Change Model
		</CdsButton>

		<CdsFlexbox
			justify="center"
			style="background-color: grey; padding: 30px"
		>
			<div style="width: 1000px">
				<CitizenSummaryViewer :citizen="citizen" />
			</div>
		</CdsFlexbox>

		<div>
			<EditCitizenSidesheet
				v-model="showEditSidesheet"
				citizen="Jose"
				:with-overlay="true"
			/>
		</div>
		<CdsButton @button-click="showEditSidesheet = true">
			Abrir Sidesheet de edição
		</CdsButton>

		<div>
			<CreateCitizenSidesheet
				v-model="showCreateSidesheet"
				:with-overlay="true"
			/>
		</div>
		<CdsButton @button-click="showCreateSidesheet = true">
			Abrir Sidesheet de criação
		</CdsButton>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CitizenSelect from './components/CitizenSelect.vue';
import CitizenSummaryViewer from './components/CitizenSummaryViewer.vue';
import EditCitizenSidesheet from './components/EditCitizenSidesheet.vue';
import CreateCitizenSidesheet from './components/CreateCitizenSidesheet.vue';

const citizen = ref<CitizenSelectModelType>(null);
const showCreateSidesheet = ref<boolean>(false);
const showEditSidesheet = ref<boolean>(false);

changeModel();

function changeModel() {
	console.log('no change model');
	citizen.value = {
		id: '05954ccb-188b-4e56-bba8-53211d60e343',
		name: 'Dr. Monique Orn',
		gender: 'F',
		cpf_responsible: null,
		mother_name: 'Jaime Powlowski DDS',
		cpf: '56826137918',
		cns: '440541140933040',
		birth_date: '1946-10-02',
		phone: '38 4017-7733',
		cellphone: '83 7530-1849',
		email: 'joaopaulosncastro@sysvale.com.br',
		address: {
			cep: '44443',
			street: 'Jakubowski Manors',
			number: '625',
			complement: 'Suite 152',
			neighborhood: 'Shanahan Glen',
			city: 'Albinborough',
			uf: 'NY',
		},
		race: 'black',
		co_cidadao: 2852,
		is_dead: true,
		pregnant: true,
		identification_document: '040516263',
		issuing_agency: 'SSP',
	};
}
</script>
<style>
body {
	font-family: 'Satoshi', sans-serif;
}
</style>
