import { computed, ref } from 'vue';

export default function createPaginationState() {
	const currentPage = ref(1);
	const nextPage = ref<string>();
	const hasNextPage = computed(() => !!nextPage.value);

	return {
		currentPage,
		nextPage,
		hasNextPage,
	};
}

export type PaginationState = ReturnType<typeof createPaginationState>;
