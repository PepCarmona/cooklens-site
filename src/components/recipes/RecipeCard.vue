<template>
    <div
        class="card"
        :class="{ pointer: !isWeekPlan }"
        @click="checkOpenRecipeDetails"
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
                    <i
                        v-if="isFavoriteRecipe(recipe)"
                        @click.stop="toggleFavRecipe(recipe)"
                        class="las la-heart"
                    ></i>
                    <i
                        v-else
                        @click.stop="toggleFavRecipe(recipe)"
                        class="lar la-heart"
                    ></i>
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
                    <i class="las la-clock"></i>
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
            <button class="seeMore" @click="seeMoreInfoAboutRecipe">
                See more
            </button>
            <button class="addToWeekPlan" @click="selectRecipe">
                Add to this week plan
                <i class="las la-arrow-right" style="font-size: 16px"></i>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { Recipe } from '@/api/types/recipe';
import { computed, defineComponent, PropType } from 'vue';
import Rating from '@/components/shared/Rating.vue';
import useAuthState from '@/store/auth-state';
import useUserState from '@/store/user-state';
import useRecipeState from '@/store/recipe-state';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'RecipeCard',

    components: {
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

    emits: ['selectedRecipe', 'seeMoreInfoAboutRecipe'],

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

        function checkOpenRecipeDetails() {
            if (!props.isWeekPlan) {
                openRecipeDetails();
            }
        }

        function selectRecipe() {
            emit('selectedRecipe', props.recipe);
        }

        function seeMoreInfoAboutRecipe() {
            emit('seeMoreInfoAboutRecipe', props.recipe);
        }

        return {
            authenticatedUser,
            isFavoriteRecipe,
            formattedTime,
            toggleFavRecipe,
            openRecipeDetails,
            checkOpenRecipeDetails,
            selectRecipe,
            seeMoreInfoAboutRecipe,
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
