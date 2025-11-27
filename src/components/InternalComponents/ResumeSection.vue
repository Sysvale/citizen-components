<template>
	<CdsFlexbox
		gap="1"
		direction="column"
		class="resume-section"
	>
		<CdsDivider
			:text="title"
			inline
			dimmed
		/>

		<CdsGrid
			cols="minmax(25%, 200px) minmax(25%, 200px) minmax(25%, 200px)"
			row-gap="3"
			col-gap="6"
		>
			<CdsGridItem
				v-for="item in items"
				:key="item.label"
				:col-span="item.fill ? 3 : 1"
			>
				<CdsText
					as="body-2"
					color="n-600"
					font-weight="semibold"
				>
					{{ item.label }}:
				</CdsText>
				<CdsText
					as="body-2"
					color="n-600"
				>
					{{ item.value }}
				</CdsText>
			</CdsGridItem>
		</CdsGrid>
	</CdsFlexbox>
</template>

<script setup lang="ts">
defineProps<{
	title: string,
	items: Array<{ label: string, value: Nullable<string>, fill?: boolean }>,
}>()
</script>

<style lang="scss" scoped>
</style>
