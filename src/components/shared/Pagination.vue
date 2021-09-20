<template>
    <div class="pagination-container">
        <button
            v-if="page > 1"
            @click="previousPage"
            class="mr-05"
            title="previous page"
        >
            <ArrowLeftIcon size="xl" />
        </button>
        <div v-if="page" class="numbers">
            <span v-if="page > 1" class="previous">{{ page - 1 }}</span>
            <span class="current">{{ page }}</span>
            <span v-if="next !== null" class="next">{{ next }}</span>
        </div>
        <button
            v-if="next !== null"
            @click="nextPage"
            class="ml-05"
            title="next page"
        >
            <ArrowRightIcon size="xl" />
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
    EOS_KEYBOARD_ARROW_RIGHT_OUTLINED as ArrowRightIcon,
    EOS_KEYBOARD_ARROW_LEFT_OUTLINED as ArrowLeftIcon,
} from 'eos-icons-vue3';

export default defineComponent({
    name: 'Pagination',

    props: {
        page: Number,
        next: Number || null,
    },

    components: {
        ArrowRightIcon,
        ArrowLeftIcon,
    },

    emits: ['previousPage', 'nextPage'],

    setup(props, { emit }) {
        return {
            previousPage() {
                emit('previousPage');
            },
            nextPage() {
                emit('nextPage');
            },
        };
    },
});
</script>

<style scoped>
.pagination-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.current {
    font-size: 1.2rem;
    font-weight: 600;
}
.previous,
.next {
    font-size: 0.8rem;
}
.previous {
    margin-right: 0.2rem;
}
.next {
    margin-left: 0.2rem;
}
</style>
