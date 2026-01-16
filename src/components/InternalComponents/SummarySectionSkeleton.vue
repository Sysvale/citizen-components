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
				v-for="item in 6"
				:key="item"
				:col-span="1"
			>
				<CdsSkeleton
					width="100"
					height="25"
				/>
				<CdsSpacer margin-top="1">
					<CdsSkeleton
						width="150"
						height="20"
					/>
				</CdsSpacer>
			</CdsGridItem>
		</CdsGrid>
	</CdsFlexbox>
</template>

<script setup lang="ts">
defineProps({
	title: {
		type: String,
		default: 'Seção',
	},
});
</script>
