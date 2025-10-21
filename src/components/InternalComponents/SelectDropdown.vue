<template>
	<div
		ref="dropdown-select"
		class="select"
	>
		<div class="select__container">
			<div
				ref="select-options"
				class="select__options"
			>
				<ul
					v-if="localOptions.length > 0"
					class="option__container"
				>
					<li
						v-for="(option, index) in localOptions"
						:key="option.id"
						:ref="el => setLiRef(el, index)"
						class="option__text"
						@mousedown.left="selectItem"
						@mouseover="highlightOnMouseOver(index)"
						@mouseout="unhighlightOnMouseOut()"
					>
						<slot
							name="option"
							:index
							:option
							:value="getOptionValue(option)"
						>
							{{ getOptionValue(option) }}
						</slot>
					</li>
				</ul>

				<ul
					v-else
					class="option__container"
				>
					<li class="option__text--muted">Nenhuma opção encontrada</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, computed, type Ref, type ComponentPublicInstance } from 'vue';
import { cloneDeep } from 'lodash';

const model = defineModel<CitizenSelectModelType>('modelValue');

const props = withDefaults(
	defineProps<{
		options: Citizen[];
		fluid?: boolean;
		optionsField: keyof Citizen;
		returnValue?: boolean;
	}>(),
	{
		fluid: false,
		returnValue: false,
	}
);

const currentPos = ref(0);
const localOptions = ref<Citizen[]>([]) as Ref<Citizen[]>;
const localValue = ref<Citizen | Partial<Citizen>>();
const liRefs = ref<HTMLLIElement[]>([]);

const selectContainerWidth = computed(() => {
	return props.fluid ? '100%' : 'fit-content';
});

watch(
	() => props.options,
	newValue => {
		liRefs.value = [];
		localOptions.value = newValue;
	},
	{ immediate: true, flush: 'pre' }
);

watch(
	model,
	newValue => {
		if (!newValue) {
			localValue.value = undefined;
			return;
		}

		if (newValue instanceof Object) {
			localValue.value = newValue;
		} else {
			localValue.value = {
				id: crypto.randomUUID(),
				[props.optionsField]: newValue,
			};
		}
	},
	{ immediate: true }
);

watch(
	localValue,
	currentValue => {
		if (!currentValue) {
			model.value = null;
			return;
		}

		const isValidOption = localOptions.value.some(
			option => option.id === currentValue.id
		);

		if (!isValidOption) return;

		if (props.returnValue) {
			model.value = currentValue[props.optionsField] as Partial<Citizen>;
		} else {
			model.value = currentValue as Citizen;
		}
	},
	{ deep: true }
);

function setLiRef(el: Element | ComponentPublicInstance | null, index: number) {
	if (el && el instanceof HTMLLIElement) {
		liRefs.value[index] = el;
	}
}

function selectItem() {
	localValue.value = cloneDeep(localOptions.value[currentPos.value]) as Partial<Citizen>;
}

function getLiInDOM(position: number) {
	if (!liRefs.value) return null;
	return liRefs.value[position];
}

function highlightOnMouseOver(index: number) {
	currentPos.value = index;
	const element = getLiInDOM(currentPos.value);
	element?.classList.add('highlight');
}

function unhighlightOnMouseOut() {
	const element = getLiInDOM(currentPos.value);
	element?.classList.remove('highlight');
}

function getOptionValue(option: Citizen): Citizen[keyof Citizen] {
	return option[props.optionsField];
}
</script>

<style lang="scss" scoped>
@import '@sysvale/cuida/dist/@sysvale/tokens.scss';

.select {
	width: v-bind(selectContainerWidth);
	min-width: 266px;
	position: relative;

	&__container {
		position: relative;
	}

	&__options {
		@include body-2;
		color: $n-700;
		outline: 1px solid $n-40;
		display: flex;
		flex-direction: column;
		margin-top: 6px;
		justify-items: center;
		text-overflow: ellipsis;
		max-height: 296px;
		overflow: auto;
		position: absolute;
		z-index: 999;
		background-color: $n-0;
		border-radius: $border-radius-extra-small;
		animation: slide-down 0.2s ease-in-out;
		min-width: 266px;
		width: v-bind(selectContainerWidth);

		&::-webkit-scrollbar {
			width: 12px;
			border-radius: 20px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background: $n-100;
			border-radius: 5px;
			border-right: 3px solid transparent;
			border-left: 3px solid transparent;
			background-clip: padding-box;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: $n-50;
		}
	}
}

@keyframes slide-down {
	0% {
		opacity: 0;
		transform: translateY(-10px);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

.option {
	&__text {
		padding: pa(3);
		text-overflow: ellipsis;

		&--muted {
			@extend .option__text;
			color: $n-400;
		}
	}

	&__container {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
}

.highlight {
	background-color: $n-10;
	cursor: pointer;
}
</style>
