<template>
    <div class="modalContent">
        <span class="mb-1"><slot /></span>
        <LoadingSpinner class="m-auto" size="xxxl" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EOS_LOADING_ANIMATED as LoadingSpinner } from 'eos-icons-vue3';

export default defineComponent({
    name: 'LoadingModal',

    components: {
        LoadingSpinner,
    },

    setup() {
        return {};
    },
});
</script>

<style scoped>
.modalContent > * {
    display: block;
}
.modalContent > span {
    font-size: 1.2rem;
    font-weight: 600;
}
</style>
