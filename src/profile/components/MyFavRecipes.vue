<template>
	<div class="my-fav-recipes-container">
		<PageHeader @go-back="back">
			<template v-slot:title>My Favorite Recipes</template>
		</PageHeader>
		<LoadingSpinner v-if="isLoadingUser" />
		<RecipeList v-else :recipes="favRecipes" slim />
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

import LoadingSpinner from '@/shared/LoadingSpinner.vue';
import PageHeader from '@/shared/PageHeader.vue';
import RecipeList from '@/recipes/components/RecipeList.vue';
import { LoadingStateKey, UserStateKey } from '@/injectionKeys';

export default defineComponent({
	name: 'MyFavRecipes',

	components: {
		LoadingSpinner,
		RecipeList,
		PageHeader,
	},

	setup() {
		const userState = inject(UserStateKey)!;
		const { getFavRecipes, favRecipes } = userState;

		const loadingState = inject(LoadingStateKey)!;
		const { isLoadingUser } = loadingState;

		const router = useRouter();

		onBeforeMount(() => getFavRecipes());

		function back() {
			router.push({
				name: 'Profile',
			});
		}

		return {
			favRecipes,
			isLoadingUser,
			back,
		};
	},
});
</script>

<style lang="scss" scoped>
.my-fav-recipes-container {
	background-color: var(--background-color);
}
</style>
