<template>
	<div class="input-wrapper" :class="{ slim, showArrows }">
		<div v-if="showArrows" class="arrow" :class="{ disabled: valueIsMin }">
			<i @click="removeToValue" class="las la-minus"></i>
		</div>
		<div class="input-container inner" :class="{ slim }">
			<input
				type="number"
				:name="`number-input-${id}`"
				:value="value"
				:class="{
					valid: !!modelValue && modelValue.toString().length > 0,
					slim: !label,
					'text-center': !label,
					'hide-value': value === 0 && !!emptyIf0 && !manual0Input,
				}"
				@input="handleInput"
				@focus="saveInitialValue"
				@blur="checkInput"
				ref="input"
			/>
			<label v-if="label" :for="`number-input-${id}`" @click="input.focus()">
				{{ label }}
			</label>
			<div class="focusedBorder"></div>
		</div>
		<div v-if="showArrows" class="arrow" :class="{ disabled: valueIsMax }">
			<i @click="addToValue" class="las la-plus"></i>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

export default defineComponent({
	name: 'CustomNumberInput',

	props: {
		modelValue: {
			type: Number,
			required: true,
		},
		id: String,
		min: Number,
		max: Number,
		maxLength: {
			type: Number,
			default: 3,
		},
		step: {
			type: Number,
			default: 1,
		},
		label: String,
		slim: Boolean,
		emptyIf0: Boolean,
		showArrows: Boolean,
		suffix: String,
	},

	emits: ['update:modelValue'],

	setup(props, { emit }) {
		const value = ref(props.modelValue);
		const onFocusValue = ref<string | null>(null);

		const manual0Input = ref(false);

		const input = ref<HTMLInputElement>();

		watch(
			() => props.modelValue,
			() => {
				value.value = props.modelValue;
			}
		);

		const valueIsMin = computed(() => value.value === props.min);

		const valueIsMax = computed(() => {
			if (input.value !== undefined) {
				const nextValue = (value.value + props.step).toString();

				return (
					value.value === props.max ||
					(input.value !== undefined &&
						nextValue.replaceAll(/\./g, '').length > props.maxLength)
				);
			}
			return false;
		});

		function handleInput() {
			manual0Input.value = true;
			if (!input.value?.value) {
				return;
			}

			value.value = parseFloat(input.value!.value);
			input.value.value = value.value.toString();

			const numberOfDigits = input.value.value
				.replaceAll(',', '')
				.replaceAll('.', '').length;

			if (numberOfDigits > props.maxLength) {
				let trimLength = props.maxLength;
				if (input.value.value.search(/\./g) > -1) {
					trimLength += 1;
				}
				input.value.value = input.value.value.substr(0, trimLength);
			}

			if (
				input.value.value.length > 1 &&
				input.value.value.charAt(0) === '0' &&
				input.value.value.search(',') === -1
			) {
				input.value.value = input.value.value.substr(
					1,
					input.value.value.length
				);
			}

			value.value = parseFloat(input.value.value);

			emit('update:modelValue', value.value);
		}

		function checkInput() {
			if (input.value!.value === '') {
				value.value = 0;
				input.value!.value = '0';
			}

			if (input.value!.value === '0') {
				manual0Input.value = false;
			}

			if (
				props.min !== undefined &&
				parseFloat(input.value!.value) < props.min
			) {
				value.value = props.min;
				input.value!.value = props.min.toString();
			}

			if (
				props.max !== undefined &&
				parseFloat(input.value!.value) > props.max
			) {
				value.value = props.max;
				input.value!.value = props.max.toString();
			}

			value.value = parseFloat(input.value!.value);

			emit('update:modelValue', value.value);
		}

		function removeToValue() {
			// If value is below min, set value to min
			if (
				props.min !== undefined &&
				parseFloat(input.value!.value) < props.min
			) {
				value.value = props.min;
			}

			// Don't remove step to value if it is already at min
			if (props.min === undefined || value.value > props.min) {
				value.value = parseFloat(input.value!.value!);
				value.value = value.value - props.step;
			}

			emit('update:modelValue', value.value);
		}

		function addToValue() {
			// If value is above max, set value to max
			if (
				props.max !== undefined &&
				parseFloat(input.value!.value) > props.max
			) {
				value.value = props.max;
			}

			// Don't add step to value if it is already at max
			if (!props.max || value.value < props.max) {
				value.value = parseFloat(input.value!.value!);
				value.value = value.value + props.step;
			}

			emit('update:modelValue', value.value);
		}

		function saveInitialValue(event: Event) {
			if ((event.target as HTMLInputElement).value === '0') {
				(event.target as HTMLInputElement).value = '';
			}
			onFocusValue.value = (event.target as HTMLInputElement).value;
		}
		return {
			value,
			onFocusValue,
			handleInput,
			checkInput,
			removeToValue,
			addToValue,
			input,
			valueIsMin,
			valueIsMax,
			saveInitialValue,
			manual0Input,
		};
	},
});
</script>

<style lang="scss" scoped>
.input-wrapper {
	position: relative;
	overflow: hidden;
	height: fit-content;
}

.input-container {
	&.inner {
		width: 100%;
		align-items: center;
		justify-content: center;
	}
	&.slim {
		height: 25px;
	}
}
input {
	position: relative;
	line-height: 1;
	top: 0;
	left: 0;
	width: 100%;
	/* height: 100%; */
	margin: 0;
	border: none;
	outline: none;
	padding: 24px 2px 6px 2px;
	background-color: transparent;
	border-bottom: 1px solid var(--shadow-color);

	-moz-appearance: textfield;
	&.slim {
		padding-top: 0;
	}
	&.hide-value {
		color: transparent;
	}
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

input:focus + label,
input.valid + label {
	font-size: 12px;
	bottom: calc(100% - 20px);
	left: 2px;
	margin: 0;
	height: fit-content;
	color: var(--grey-600);
	z-index: 99;
}
input:focus + label + .focusedBorder {
	width: 100%;
	left: 0;
}
label {
	position: absolute;
	bottom: 0.5rem;
	left: 2px;
	color: var(--grey-800);
	line-height: 1;
	transition: all 0.2s ease;
	z-index: 0;
}
.focusedBorder {
	position: absolute;
	width: 0;
	bottom: 0;
	left: 50%;
	border-bottom: 2px solid var(--accent-color);
	transition: all 0.2s ease;
}

.showArrows {
	display: flex;
	align-items: flex-end;
	& i {
		color: var(--accent-color);
		font-size: 20px;
	}
	& input {
		text-align: center;
	}
}

.arrow {
	cursor: pointer;
	flex-shrink: 0;
	width: 25%;
	padding-bottom: 3px;
	&.disabled {
		opacity: 0.3;
		pointer-events: none;
	}
}
</style>
