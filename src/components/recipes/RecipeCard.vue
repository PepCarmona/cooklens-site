<template>
    <div class="card">
        <div class="image">
            <img
                v-if="!recipe.images || !recipe.images.length > 0"
                src="https://via.placeholder.com/400x300.webp"
                :alt="recipe.title"
            />
            <img v-else :src="recipe.images[0]" height="300" width="400" />
        </div>
        <div class="content d-flex p-1">
            <div class="row">
                <div class="title w-80 text-left">{{ recipe.title }}</div>
                <div
                    v-if="authenticatedUser"
                    class="w-20 d-flex align-items-center justify-end"
                >
                    <FavFilledIcon
                        v-if="isFavoriteRecipe(recipe)"
                        @click.stop="toggleFavRecipe(recipe)"
                        size="l"
                    />
                    <FavIcon
                        v-else
                        @click.stop="toggleFavRecipe(recipe)"
                        size="l"
                    />
                </div>
            </div>
            <div class="row mt-2">
                <div class="w-50 d-flex align-center">
                    <Rating
                        onlyDisplay
                        :recipeRating="recipe.rating"
                        :size="'l'"
                    />
                </div>
                <div class="w-50 d-flex justify-end align-center">
                    <ClockIcon size="l" />
                    <span class="ml-05">{{ formattedTime }}</span>
                </div>
            </div>
            <div class="row">
                <div
                    class="pill mx-05"
                    v-for="tag in recipe.tags"
                    :key="tag._id"
                >
                    {{ tag.value }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Recipe } from '@/api/types/recipe';
import { computed, defineComponent, PropType } from 'vue';
import {
    EOS_FAVORITE_OUTLINED as FavIcon,
    EOS_FAVORITE_FILLED as FavFilledIcon,
    EOS_SCHEDULE_OUTLINED as ClockIcon,
} from 'eos-icons-vue3';
import Rating from '@/components/shared/Rating.vue';
import useAuthState from '@/store/auth-state';
import useUserState from '@/store/user-state';
import useRecipeState from '@/store/recipe-state';

export default defineComponent({
    name: 'RecipeCard',

    components: {
        FavIcon,
        FavFilledIcon,
        ClockIcon,
        Rating,
    },

    props: {
        recipe: {
            type: Object as PropType<Recipe>,
            required: true,
        },
    },

    setup(props) {
        const { authenticatedUser } = useAuthState();
        const { toggleFavRecipe } = useUserState();
        const { isFavoriteRecipe } = useRecipeState();

        const formattedTime = computed(() => {
            const totalTime = props.recipe.time.preparation
                ? props.recipe.time.preparation + props.recipe.time.cooking
                : props.recipe.time.cooking;

            const hours = Math.floor(totalTime / 60);
            const minutes = totalTime % 60;

            const formattedTime =
                hours > 0 ? `${hours} h  ${minutes} min` : `${minutes} min`;

            return formattedTime;
        });

        return {
            authenticatedUser,
            isFavoriteRecipe,
            formattedTime,
            toggleFavRecipe,
        };
    },
});
</script>

<style scoped>
.card {
    max-width: 400px;
    border: 1px solid var(--main-color);
    margin-top: 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
}

.image > img {
    width: 100%;
}
.content {
    flex-wrap: wrap;
}
.title {
    font-size: 1.2rem;
    font-weight: 600;
}

.pill {
    position: relative;
    width: fit-content;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    background: var(--main-color);
    border-radius: 20px;
    color: var(--main-light-color);
}
</style>
