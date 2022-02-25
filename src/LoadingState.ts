import { ref } from 'vue';

export type LoadingService = 'recipes' | 'user' | 'auth' | 'mealPlan';

export default function createLoadingState() {
	const loadingServices = ref<Set<LoadingService>>(new Set());

	function startLoading(state: LoadingService) {
		loadingServices.value.add(state);
	}

	function endLoading(state: LoadingService) {
		loadingServices.value.delete(state);
	}

	function isLoading(state: LoadingService) {
		return loadingServices.value.has(state);
	}

	return {
		isLoading,
		startLoading,
		endLoading,
	};
}

export type LoadingState = ReturnType<typeof createLoadingState>;
