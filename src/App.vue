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

		<CreateCitizenForm ref="createCitizenFormRef" />
		<CdsButton @click="handle"> Submit </CdsButton>
	</div>
</template>

<script setup lang="ts">
import { ref, type VNodeRef } from 'vue';
import CreateCitizenForm from './components/CreateCitizenForm.vue';

const createCitizenFormRef = ref<VNodeRef | null>(null);

function handle() {
	createCitizenFormRef.value.create();
}
</script>

<style>
body {
	font-family: 'Satoshi', sans-serif;
}
</style>
