import { readonly, ref } from 'vue';

export default function createPaginationState() {
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
		currentPage: readonly(currentPage),
		nextPageExists: readonly(nextPageExists),

		goToPreviousPage,
		goToNextPage,
		goToPage,
		checkIfNextPageExists,
	};
}
