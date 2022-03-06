import { ref } from 'vue';

export default function createPaginationState() {
	const currentPage = ref(1);
	const nextPageExists = ref(false);

	return {
		currentPage,
		nextPageExists,
	};
}

export type PaginationState = ReturnType<typeof createPaginationState>;
