<template>
	<div class="import-container" :class="{ thin }">
		<input ref="input" type="text" placeholder="Url" @keypress="autoImport" />
		<div class="separator"></div>

		<Button @click="importFromUrl" :loading="isLoadingRecipes" primary>
			IMPORT
		</Button>
		<div v-if="importErrors" class="errors">
			{{ importErrors }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref } from 'vue';

import { Recipe } from 'cooklens-types';

import { isMobile } from '@/helpers/media';
import { LoadingStateKey, RecipeServiceKey } from '@/injectionKeys';

export default defineComponent({
	name: 'ImportRecipe',

	props: {
		thin: Boolean,
	},

	emits: ['importedRecipe'],

	setup(_, { emit }) {
		const input = ref<HTMLInputElement>();

		const importErrors = ref<string | null>(null);

		const loadingState = inject(LoadingStateKey)!;
		const { isLoadingRecipes } = loadingState;

		const recipeService = inject(RecipeServiceKey)!;

		onMounted(() => {
			if (!isMobile) {
				input.value?.focus();
			}
		});

		function importFromUrl() {
			const inputUrl = input.value?.value ?? '';

			importErrors.value = null;

			if (inputUrl === '') {
				importErrors.value = 'Input URL is empty';
				return;
			}

			recipeService
				.importRecipe(inputUrl)
				.then((importedRecipe: Recipe) => {
					emit('importedRecipe', importedRecipe);
				})
				.catch((err: string) => {
					importErrors.value = err;
				});
		}

		function autoImport(event: KeyboardEvent) {
			if (event.key === 'Enter') {
				importFromUrl();
			}
		}

		return {
			input,
			importErrors,
			isLoadingRecipes,
			importFromUrl,
			autoImport,
		};
	},
});
</script>

<style lang="scss" scoped>
input {
	background-color: var(--grey-100);
	color: var(--grey-800);
	border-radius: 1rem;
	padding: 0.8rem;
	margin-top: 2.5rem;
	border: 2px solid var(--grey-100);
	outline: none;
	width: 100%;
	transition: all 0.2s ease;
	&:focus {
		border: 2px solid var(--accent-color-transparent);
		&::placeholder {
			opacity: 0;
		}
	}
}

button {
	margin-top: 1.5rem;
	margin-bottom: 2rem;
	width: 100%;
}

.separator {
	margin: 1.5rem 0;
	border-bottom: 1px solid var(--border-color);
}

.errors {
	margin-top: 0.5rem;
	color: var(--error-color);
	font-size: 0.8rem;
}
</style>
