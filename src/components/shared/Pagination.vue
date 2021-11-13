<template>
    <div class="pagination-container">
        <div class="pagination-inner-container">
            <button
                v-if="currentPage > 1"
                @click="previousPage"
                class="mr-05"
                title="previous page"
            >
                <i class="las la-angle-left"></i>
            </button>
            <div
                v-if="currentPage"
                class="numbers"
                :class="{
                    'empty-left': currentPage <= 1,
                    'empty-right': !nextPageExists,
                }"
            >
                <span v-if="currentPage > 1" class="previous">
                    {{ currentPage - 1 }}
                </span>
                <span class="current">{{ currentPage }}</span>
                <span v-if="nextPageExists" class="next">
                    {{ currentPage + 1 }}
                </span>
            </div>
            <button
                v-if="nextPageExists"
                @click="nextPage"
                class="ml-05"
                title="next page"
            >
                <i class="las la-angle-right"></i>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import usePaginationState from '@/store/pagination-state';

export default defineComponent({
    name: 'Pagination',

    props: {
        nextPageExists: Boolean,
    },

    emits: ['previousPage', 'nextPage'],

    setup(_, { emit }) {
        const { currentPage } = usePaginationState();
        return {
            currentPage,
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
i {
    font-size: 16px;
}
.pagination-container {
    width: 100%;
    display: flex;
    justify-content: center;
}

.pagination-inner-container {
    width: 115px;
    display: flex;
    align-items: center;
}

.numbers {
    width: 32px;
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

.empty-left {
    margin-left: calc(0.5rem + 32px);
    text-align: right;
}
.empty-right {
    margin-right: calc(0.5rem + 32px);
    text-align: left;
}
</style>
