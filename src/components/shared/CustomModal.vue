<template>
    <transition name="master">
        <div v-show="showIf" class="modal-container">
            <transition name="fade">
                <div
                    v-if="showIf"
                    class="modal-overlay"
                    :class="mode"
                    @click.self="close"
                />
            </transition>
            <transition name="slide">
                <div
                    v-if="showIf"
                    class="modal"
                    :class="({ transparent, thin }, mode)"
                >
                    <slot></slot>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export type modalLateralMode =
    | 'left'
    | 'right'
    | 'bottom'
    | 'full'
    | 'center'
    | 'top';

export default defineComponent({
    name: 'CustomModal',

    props: {
        showIf: Boolean,
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
.modal-container {
    display: flex;
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 999;
    backdrop-filter: blur(1px);
}
.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--dark-shadow-color);
}
.modal-overlay.right {
    justify-content: flex-end;
}
.modal-overlay.right > .modal {
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
    position: relative;
    margin: auto;
    height: fit-content;
    max-height: calc(100% - 2rem);
    overflow: auto;
    width: calc(100% - 2rem);
    padding: 1.5rem;
    border-radius: 1rem;
    background-color: var(--background-contrast-color);
    z-index: 1000;
}
.modal.transparent {
    border: none;
    background-color: transparent;
}
.modal.thin {
    padding: 1rem;
}
.modal.top {
    width: 100%;
    margin-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.master-enter-active,
.master-leave-active {
    transition: all 0.4s;
}
.master-enter-from,
.master-leave-to {
    opacity: 0.999;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.4s;
}
.center.slide-leave-to,
.center.slide-enter-from {
    transform: scale(0);
    opacity: 0;
}
.top.slide-leave-to,
.top.slide-enter-from {
    transform: translateY(-100vh);
}

@media only screen and (min-width: 767px) {
    .modal-overlay.right > .modal {
        width: 450px;
        border-left: 1px solid var(--main-dark-color);
    }
    .modal {
        width: fit-content;
        max-width: 90vw;
    }
    .modal.top {
        max-width: 100vw;
    }
}
</style>
