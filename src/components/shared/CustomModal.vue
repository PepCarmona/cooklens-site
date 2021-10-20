<template>
    <div class="modalOverlay" @click="close">
        <div class="modal" :class="{ transparent }">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CustomModal',

    props: {
        transparent: Boolean,
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
    display: none;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    background-color: var(--third-transparent-color);
    z-index: 15;
}
.modal {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    position: fixed;
    height: fit-content;
    max-height: 90vh;
    width: 90vw;
    padding: 2rem;
    border-radius: 5px;
    border: 1px solid var(--main-dark-color);
    background-color: var(--main-light-color);
    z-index: 16;
}
.modal.transparent {
    border: none;
    background-color: transparent;
}

@media only screen and (min-width: 767px) {
    .modal {
        width: fit-content;
        max-width: 90vw;
    }
}
</style>
