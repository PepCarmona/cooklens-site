import { computed, ref } from 'vue';

export type LoadingService = 'recipes' | 'user' | 'auth' | 'mealPlan';

export default function createLoadingState() {
	const loadingServices = ref<Set<LoadingService>>(new Set());

	function startLoading(state: LoadingService) {
		loadingServices.value.add(state);
	}

	function endLoading(state: LoadingService) {
		loadingServices.value.delete(state);
	}

	const isLoadingRecipes = computed(() => loadingServices.value.has('recipes'));
	const isLoadingUser = computed(() => loadingServices.value.has('user'));
	const isLoadingAuth = computed(() => loadingServices.value.has('auth'));
	const isLoadingMealPlan = computed(() =>
		loadingServices.value.has('mealPlan')
	);

	return {
		isLoadingRecipes,
		isLoadingUser,
		isLoadingAuth,
		isLoadingMealPlan,

		startLoading,
		endLoading,
	};
}

export type LoadingState = ReturnType<typeof createLoadingState>;
