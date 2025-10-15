<template>
	<div>
		<CdsGrid
			:cols="2"
			gap="32px"
			class="pa-10 mt-12"
		>
			<div style="background-color: coral">
				<CitizenSelect
					v-model="md"
					show-button
				/>
			</div>
			<div style="background-color: coral">
				<CitizenSelect
					show-button
					fluid
				/>
			</div>
			<div style="background-color: coral">
				<CitizenSelect
					show-button
					fluid
				/>
			</div>
		</CdsGrid>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CitizenSelect from './components/CitizenSelect.vue';

const md = ref<CitizenModelType>(null);
</script>

