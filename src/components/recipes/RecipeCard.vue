<template>
    <div
        class="card"
        :class="{ pointer: !isWeekPlan }"
        @click="!isWeekPlan && openRecipeDetails"
    >
        <div v-if="!isWeekPlan" class="image">
            <img
                v-if="!recipe.images || !recipe.images.length > 0"
                src="https://via.placeholder.com/400x300.webp"
                :alt="recipe.title"
            />
            <img v-else :src="recipe.images[0]" height="300" width="400" />
        </div>
        <div class="content d-flex p-1">
            <div class="row">
                <div class="title">{{ recipe.title }}</div>
                <div v-if="authenticatedUser" class="fav">
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
                <div class="rating">
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
        <div v-if="isWeekPlan" class="weekPlanButtons">
            <button class="seeMore" @click="openRecipeDetails">See more</button>
            <button class="addToWeekPlan" @click="selectRecipe">
                Add to this week plan
                <ArrowIcon />
            </button>
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
    EOS_ARROW_FORWARD as ArrowIcon,
} from 'eos-icons-vue3';
import Rating from '@/components/shared/Rating.vue';
import useAuthState from '@/store/auth-state';
import useUserState from '@/store/user-state';
import useRecipeState from '@/store/recipe-state';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'RecipeCard',

    components: {
        FavIcon,
        FavFilledIcon,
        ClockIcon,
        ArrowIcon,
        Rating,
    },

    props: {
        recipe: {
            type: Object as PropType<Recipe>,
            required: true,
        },
        isWeekPlan: {
            type: Boolean,
            default: false,
        },
    },

    emits: ['selectedRecipe'],

    setup(props, { emit }) {
        const router = useRouter();

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

        function openRecipeDetails() {
            const formattedTitle = props.recipe.title
                .toLowerCase()
                .replaceAll(' ', '-');

            router.push({
                name: 'RecipeDetails',
                params: { title: formattedTitle },
                query: { id: props.recipe._id! },
            });
        }

        function selectRecipe() {
            emit('selectedRecipe', props.recipe);
        }

        return {
            authenticatedUser,
            isFavoriteRecipe,
            formattedTime,
            toggleFavRecipe,
            openRecipeDetails,
            selectRecipe,
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
}
.card.pointer {
    cursor: pointer;
}

.image > img {
    width: 100%;
}
.content {
    flex-wrap: wrap;
}
.title {
    width: 80%;
    text-align: left;
    font-size: 1.2rem;
    font-weight: 600;
}

.fav {
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.fav > * {
    cursor: pointer;
}

.rating {
    width: 50%;
    display: flex;
    align-items: center;
}
.rating > * {
    cursor: pointer;
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

.weekPlanButtons {
    display: flex;
    margin-top: 1rem;
}
.weekPlanButtons > * {
    width: 50%;
    padding: 0.5rem;
    background-color: var(--secondary-light-color);
}
.weekPlanButtons > *:hover {
    background-color: var(--secondary-color);
}
</style>
