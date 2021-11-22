<template>
    <div class="modalOverlay" :class="mode" @click.self="close">
        <div class="modal" :class="{ transparent, thin }">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export type modalLateralMode = 'left' | 'right' | 'bottom' | 'full' | 'center';

export default defineComponent({
    name: 'CustomModal',

    props: {
        transparent: Boolean,
        thin: Boolean,
        mode: {
            type: String as PropType<modalLateralMode>,
            default: 'center',
        },
    },

    emits: ['close'],

    setup(_, { emit }) {
        return {
            close() {
                emit('close');
            },
        };
    },
});
</script>

<style scoped>
.modalOverlay {
    display: flex;
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    background-color: var(--dark-shadow-color);
    backdrop-filter: blur(1px);
    z-index: 999;
}
.modalOverlay.center {
    align-items: center;
    justify-content: center;
}
.modalOverlay.right {
    justify-content: flex-end;
}
.modalOverlay.right > .modal {
    height: 100vh;
    max-height: 100vh;
    width: 100%;
    border: none;
    border-radius: 0;
    flex-direction: column;
    justify-content: flex-start;
    flex-wrap: nowrap;
}

.modal {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    position: fixed;
    height: fit-content;
    max-height: calc(100% - 2rem);
    overflow: auto;
    width: calc(100% - 2rem);
    padding: 1.5rem;
    border-radius: 1rem;
    background-color: var(--background-contrast-color);
    z-index: 100;
}
.modal.transparent {
    border: none;
    background-color: transparent;
}
.modal.thin {
    padding: 1rem;
}

@media only screen and (min-width: 767px) {
    .modalOverlay.right > .modal {
        width: 450px;
        border-left: 1px solid var(--main-dark-color);
    }
    .modal {
        width: fit-content;
        max-width: 90vw;
    }
}
</style>
