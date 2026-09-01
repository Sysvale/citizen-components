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
				<CdsFlexbox gap="1">
					<CdsText
						as="caption"
						color="n-600"
						font-weight="semibold"
					>
						{{ item.label }}
					</CdsText>
					<CdsTooltip
						v-if="item.incomplete"
						text="Campo obrigatório com dados incompletos"
					>
						<CdsIcon
							height="16"
							width="16"
							name="warning-outline"
							:color="item.critical ? '#E53935' : '#EDA831'"
						/>
					</CdsTooltip>
				</CdsFlexbox>
				<CdsSpacer margin-top="1">
					<CdsText
						as="body-2"
						color="n-600"
					>
						{{ item.value }}
					</CdsText>
				</CdsSpacer>
			</CdsGridItem>
		</CdsGrid>
	</CdsFlexbox>
</template>

<script setup lang="ts">
defineProps<{
	title: string;
	items: Array<{
		label: string;
		value: Nullable<string>;
		fill?: boolean;
		incomplete?: boolean;
		critical?: boolean;
	}>;
}>();
</script>

<style lang="scss" scoped></style>
