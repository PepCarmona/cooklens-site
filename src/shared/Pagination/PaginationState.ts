import { ref } from 'vue';

export default function createPaginationState() {
	const currentPage = ref(1);
	const hasNextPage = ref(false);

	return {
		currentPage,
		hasNextPage,
	};
}

export type PaginationState = ReturnType<typeof createPaginationState>;
