import { readonly, ref } from 'vue';

export type PaginationState = ReturnType<typeof usePaginationState>;

export default function usePaginationState() {
	const currentPage = ref(1);
	const nextPageExists = ref(false);

	function goToPreviousPage() {
		currentPage.value -= 1;
	}

	function goToNextPage() {
		currentPage.value += 1;
	}

	function goToPage(page: number) {
		currentPage.value = page;
	}

	function checkIfNextPageExists(value: boolean) {
		nextPageExists.value = value;
	}

	return {
		currentPage: readonly(currentPage).value,
		nextPageExists: readonly(nextPageExists).value,

		goToPreviousPage,
		goToNextPage,
		goToPage,
		checkIfNextPageExists,
	};
}
