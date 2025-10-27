<template>
	<div>
		<!-- <CdsGrid
			:cols="2"
			gap="32px"
			class="pa-10 mt-12"
		>
			<div>
				<CitizenSelect show-button />
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
			text="Criar"
			@click="handleSidesheet"
		/>
		<CreateCitizenSidesheet
			v-model="isOpen"
			action-button-variant="teal"
			@success="v => console.log(v)"
			@error="v => console.log(v)"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreateCitizenSidesheet from './components/CreateCitizenSidesheet.vue';

const isOpen = ref(false);

function handleSidesheet() {
	isOpen.value = !isOpen.value;
}
</script>
<style>
body {
	font-family: 'Satoshi', sans-serif;
}
</style>
