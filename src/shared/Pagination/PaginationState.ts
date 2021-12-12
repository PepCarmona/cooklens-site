import { readonly, ref, Ref } from 'vue';

interface PaginationState {
    currentPage: Readonly<Ref<number>>;
    nextPageExists: Readonly<Ref<boolean>>;

    goToPreviousPage(): void;
    goToPage(page: number): void;
    goToNextPage(): void;
    checkIfNextPageExists(value: boolean): void;
}

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

export default function usePaginationState(): PaginationState {
    return {
        currentPage: readonly(currentPage),
        nextPageExists: readonly(nextPageExists),

        goToPreviousPage,
        goToNextPage,
        goToPage,
        checkIfNextPageExists,
    };
}
