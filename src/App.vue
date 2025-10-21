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

		<CreateCitizenForm />
	</div>
</template>

<script setup lang="ts">
import CreateCitizenForm from './components/CreateCitizenForm.vue';
</script>

<style>
body {
	font-family: 'Satoshi', sans-serif;
}
</style>
