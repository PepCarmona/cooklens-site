<template>
    <div class="container" :class="{ slim }">
        <div class="arrow" :class="{ disabled: valueIsMin }">
            <ArrowLeftIcon @click="removeToValue" color="white" />
        </div>
        <div class="container inner" :class="{ slim }">
            <input
                inputmode="numeric"
                @change="handleInput"
                :value="value"
                type="text"
                maxlength="3"
                pattern="([0-9]|[0-9]|[0-9])"
                :id="id"
                ref="input"
                :class="{ 'text-center': !label }"
            />
            <label v-if="label" :for="id">{{ label }}</label>
        </div>
        <div class="arrow" :class="{ disabled: valueIsMax }">
            <ArrowRightIcon @click="addToValue" color="white" />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import {
    EOS_KEYBOARD_ARROW_RIGHT_OUTLINED as ArrowRightIcon,
    EOS_KEYBOARD_ARROW_LEFT_OUTLINED as ArrowLeftIcon,
} from 'eos-icons-vue3';

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
        step: {
            type: Number,
            default: 1,
        },
        label: String,
        slim: Boolean,
    },

    components: {
        ArrowRightIcon,
        ArrowLeftIcon,
    },

    emits: ['update:modelValue'],

    setup(props, { emit }) {
        const value = ref(props.modelValue);

        const input = ref<HTMLInputElement>();

        const valueIsMin = computed(() => value.value === props.min);

        const valueIsMax = computed(() => value.value === props.max);

        function handleInput() {
            if (input.value!.value === '') {
                value.value = 0;
                input.value!.value = '0';
            }

            if (
                props.min !== undefined &&
                parseInt(input.value!.value) < props.min
            ) {
                value.value = props.min;
                input.value!.value = props.min.toString();
            }

            if (
                props.max !== undefined &&
                parseInt(input.value!.value) > props.max
            ) {
                value.value = props.max;
                input.value!.value = props.max.toString();
            }

            emit('update:modelValue', value.value);
        }

        function removeToValue() {
            // If value is below min, set value to min
            if (
                props.min !== undefined &&
                parseInt(input.value!.value) < props.min
            ) {
                input.value!.value! = props.min.toString();
                value.value = props.min;
            }

            // Don't remove step to value if it is already at min
            if (props.min === undefined || value.value > props.min) {
                value.value = parseInt(input.value!.value!);
                value.value = value.value - props.step;
            }

            emit('update:modelValue', value.value);
        }

        function addToValue() {
            // If value is below max, set value to max
            if (
                props.max !== undefined &&
                parseInt(input.value!.value) > props.max
            ) {
                input.value!.value! = props.max.toString();
                value.value = props.max;
            }

            // Don't add step to value if it is already at max
            if (!props.max || value.value < props.max) {
                value.value = parseInt(input.value!.value!);
                value.value = value.value + props.step;
            }

            emit('update:modelValue', value.value);
        }
        return {
            value,
            handleInput,
            removeToValue,
            addToValue,
            input,
            valueIsMin,
            valueIsMax,
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
    border-bottom: 1px solid black;
}

label {
    text-align: left;
    cursor: text;
    margin-right: 0.5rem;
}

.container {
    background-color: lightgrey;
    height: 40px;
    width: 100%;
    display: flex;
    flex-wrap: nowrap !important;
    align-items: center;
    margin: 0 !important;
}
.container.slim {
    height: 25px;
}

.arrow {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: fit-content;
    background-color: grey;
    height: 100%;
}
.arrow.disabled {
    opacity: 0.6;
    pointer-events: none;
}

.container.inner {
    width: 100%;
    align-items: center;
    justify-content: center;
}
</style>
