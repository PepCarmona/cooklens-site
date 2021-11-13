<template>
    <div class="input-container" :class="{ slim }">
        <div class="arrow" :class="{ disabled: valueIsMin }">
            <i
                @click="removeToValue"
                class="las la-angle-left"
                style="color: white"
            ></i>
        </div>
        <div class="input-container inner" :class="{ slim }">
            <input
                @focus="saveInitialValue"
                @input="handleInput"
                @blur="checkInput"
                :value="value"
                type="number"
                :id="id"
                ref="input"
                :class="{
                    'text-center': !label,
                    'hide-value': value === 0 && emptyIf0 && !manual0Input,
                }"
            />
            <label v-if="label" :for="id">{{ label }}</label>
        </div>
        <div class="arrow" :class="{ disabled: valueIsMax }">
            <i
                @click="addToValue"
                class="las la-angle-right"
                style="color: white"
            ></i>
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
    },

    emits: ['update:modelValue'],

    setup(props, { emit }) {
        const value = ref(props.modelValue);
        const onFocusValue = ref<string | null>(null);

        const manual0Input = ref(false);

        const input = ref<HTMLInputElement>();

        watch(props, () => {
            value.value = props.modelValue;
        });

        const valueIsMin = computed(() => value.value === props.min);

        const valueIsMax = computed(() => {
            if (input.value !== undefined) {
                const nextValue = (value.value + props.step).toString();

                return (
                    value.value === props.max ||
                    (input.value !== undefined &&
                        nextValue.replaceAll(/\./g, '').length >
                            props.maxLength)
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

<style scoped>
input {
    background: transparent;
    border: none;
    outline: none;
    text-align: right;
    width: 4ch;
    font-size: 1rem;
    max-width: 80px;
}
input:focus {
    border-bottom: 1px solid var(--main-dark-color);
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type='number'] {
    -moz-appearance: textfield;
}
input.hide-value {
    color: transparent;
}

label {
    text-align: left;
    cursor: text;
    margin-right: 0.5rem;
}

.input-container {
    background-color: var(--secondary-color);
    height: 40px;
    width: 100%;
    display: flex;
    flex-wrap: nowrap !important;
    align-items: center;
    margin: 0 !important;
}
.input-container.slim {
    height: 25px;
}

.arrow {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: fit-content;
    background-color: var(--main-color);
    height: 100%;
}
.arrow.disabled {
    opacity: 0.6;
    pointer-events: none;
}

.input-container.inner {
    width: 100%;
    align-items: center;
    justify-content: center;
}
</style>
