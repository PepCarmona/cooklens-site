<template>
    <div class="input-wrapper">
        <template v-if="type === 'textarea'">
            <textarea
                :name="`textArea-${id}`"
                :rows="rows"
                :cols="cols"
                :value="modelValue"
                :minlength="minLength"
                :maxlength="maxLength"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                :class="{
                    transparent,
                    valid: !!modelValue && modelValue.length > 0,
                    slim: !label,
                }"
                @input="handleTextArea"
                @focus="hidePlaceholder"
                @blur="restorePlaceholder"
                ref="textArea"
            />
            <label :for="`textArea-${id}`" @click="textArea.focus()">{{
                label
            }}</label>
            <div class="focusedBorder"></div>
        </template>
        <template v-else>
            <input
                :type="type"
                :name="`input-${id}`"
                :value="modelValue"
                :minlength="minLength"
                :maxlength="maxLength"
                :pattern="pattern"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                :autocomplete="autocomplete"
                :class="{
                    transparent,
                    valid: !!modelValue && modelValue.length > 0,
                    slim: !label,
                }"
                @input="handleInput"
                @focus="hidePlaceholder"
                @blur="restorePlaceholder"
                ref="input"
            />
            <label v-if="label" :for="`input-${id}`" @click="input.focus()">
                {{ label }}
            </label>
            <div class="focusedBorder"></div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue';

type InputTypes =
    | 'text'
    | 'email'
    | 'password'
    | 'tel'
    | 'date'
    | 'search'
    | 'url'
    | 'textarea';
type AutoComplete = 'on' | 'off';

export default defineComponent({
    name: 'CustomInput',

    props: {
        modelValue: {
            type: String,
            required: true,
        },
        label: String,
        id: String,
        type: {
            type: String as PropType<InputTypes>,
            default: 'text',
        },
        placeholder: String,
        pattern: String,
        minLength: Number,
        maxLength: Number,
        transparent: Boolean,
        required: Boolean,
        disabled: Boolean,
        rows: Number,
        cols: Number,
        autocomplete: {
            type: String as PropType<AutoComplete>,
            default: 'off',
        },
        autoResize: Boolean,
        keepPlaceholder: Boolean,
    },

    emits: ['update:modelValue'],

    setup(props, { emit }) {
        const textArea = ref<HTMLTextAreaElement>();
        const input = ref<HTMLInputElement>();

        onMounted(() => {
            if (props.type === 'textarea') {
                setTimeout(() => resizeTextArea(null), 50);
            }
        });

        function capitalizeFirstLetter(event: Event) {
            const input = event.target as
                | HTMLInputElement
                | HTMLTextAreaElement;

            const firstLetter = input.value.charAt(0);

            if (firstLetter === firstLetter.toLowerCase()) {
                input.value = firstLetter.toUpperCase() + input.value.slice(1);
            }
        }

        function resizeInput(event: Event) {
            const input = event.target as HTMLInputElement;
            //TODO - take into account m is bigger and i is smalloer
            input.style.width = `${input.value.length + 1}ch`;
        }

        function handleInput(event: Event) {
            capitalizeFirstLetter(event);
            if (props.autoResize) {
                resizeInput(event);
            }
            emit('update:modelValue', (event.target as HTMLInputElement).value);
        }

        function resizeTextArea(event: Event | null) {
            const _textArea = event
                ? (event.target as HTMLTextAreaElement)
                : textArea.value;

            if (_textArea) {
                _textArea.style.height = '0';
                _textArea.style.height = `${_textArea.scrollHeight + 1}px`;
            }
        }

        function handleTextArea(event: Event) {
            capitalizeFirstLetter(event);
            resizeTextArea(event);
            emit(
                'update:modelValue',
                (event.target as HTMLTextAreaElement).value
            );
        }

        function focus() {
            if (textArea.value) {
                textArea.value.focus();
            } else if (input.value) {
                input.value.focus();
            }
        }

        function hidePlaceholder() {
            if (!props.keepPlaceholder) {
                if (textArea.value) {
                    textArea.value.classList.add('hidePlaceholder');
                } else if (input.value) {
                    input.value.classList.add('hidePlaceholder');
                }
            }
        }

        function restorePlaceholder() {
            if (!props.keepPlaceholder) {
                if (textArea.value) {
                    textArea.value.classList.remove('hidePlaceholder');
                } else if (input.value) {
                    input.value.classList.remove('hidePlaceholder');
                }
            }
        }
        return {
            textArea,
            input,
            handleInput,
            handleTextArea,
            resizeTextArea,
            focus,
            hidePlaceholder,
            restorePlaceholder,
        };
    },
});
</script>

<style scoped>
.input-wrapper {
    position: relative;
    overflow: hidden;
    height: fit-content;
}
input,
textarea {
    position: relative;
    line-height: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    outline: none;
    border: none;
    padding: 24px 2px 6px 2px;
    background-color: transparent;
    border-bottom: 1px solid var(--shadow-color);
}
textarea {
    padding-bottom: 4px;
    line-height: 1.4;
    overflow: hidden;
    resize: none;
}
input.slim,
textarea.slim {
    padding-top: 0;
}
input:focus + label,
input.valid + label,
textarea:focus + label,
textarea.valid + label {
    font-size: 12px;
    bottom: calc(100% - 20px);
    left: 2px;
    margin: 0;
    height: fit-content;
    color: var(--grey-600);
    z-index: 99;
}
input:focus + label + .focusedBorder,
textarea:focus + label + .focusedBorder {
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
textarea + label {
    bottom: calc(0.5rem + 6px);
}
.focusedBorder {
    position: absolute;
    width: 0;
    bottom: 0;
    left: 50%;
    border-bottom: 2px solid var(--accent-color);
    transition: all 0.2s ease;
}
textarea + label + .focusedBorder {
    bottom: 5px;
}

.hidePlaceholder::placeholder {
    visibility: hidden;
}
</style>
