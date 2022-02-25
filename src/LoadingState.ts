import { computed, ref } from 'vue';

export type LoadingService = 'recipes' | 'user' | 'auth' | 'mealPlan';

const loadingServices = ref<Set<LoadingService>>(new Set());

const isLoadingRecipes = computed({
	get: () => loadingServices.value.has('recipes'),
	set: (value: boolean) =>
		value
			? loadingServices.value.add('recipes')
			: loadingServices.value.delete('recipes'),
});
const isLoadingUser = computed({
	get: () => loadingServices.value.has('user'),
	set: (value: boolean) =>
		value
			? loadingServices.value.add('user')
			: loadingServices.value.delete('user'),
});
const isLoadingAuth = computed({
	get: () => loadingServices.value.has('auth'),
	set: (value: boolean) =>
		value
			? loadingServices.value.add('auth')
			: loadingServices.value.delete('auth'),
});
const isLoadingMealPlan = computed({
	get: () => loadingServices.value.has('mealPlan'),
	set: (value: boolean) =>
		value
			? loadingServices.value.add('mealPlan')
			: loadingServices.value.delete('mealPlan'),
});

export const loadingState = {
	isLoadingRecipes,
	isLoadingUser,
	isLoadingAuth,
	isLoadingMealPlan,
};

export type LoadingState = typeof loadingState;
