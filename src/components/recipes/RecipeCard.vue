<template>
    <div class="card" :class="{ slim }" @click="openRecipeDetails">
        <!-- <div
            v-if="!recipe.images || !recipe.images.length > 0"
            class="image"
            :style="`background: url(https://via.placeholder.com/400x300.webp) center center / cover;`"
            :alt="recipe.title"
        ></div> -->
        <div
            v-if="recipe.images && recipe.images.length > 0"
            class="image-container"
        >
            <div
                class="image"
                :style="`background: url(${recipe.images[0]}) center center / cover;`"
                :alt="recipe.title"
            ></div>
        </div>
        <div class="content d-flex p-1">
            <div class="head">
                <div class="title">
                    {{ recipe.title }}
                </div>
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

            <div class="details">
                <div class="rating">
                    <i class="lar la-star"></i> <span>{{ recipe.rating }}</span>
                </div>
                <div class="time">
                    <i class="las la-clock"></i>
                    <span>{{ formattedTime }}</span>
                </div>
            </div>
            <div v-if="recipe.tags && recipe.tags.length > 0" class="row">
                <div
                    class="pill mx-05"
                    v-for="tag in recipe.tags"
                    :key="tag._id"
                >
                    {{ tag.value }}
                </div>
            </div>
        </div>
        <!-- <div v-if="isWeekPlan" class="weekPlanButtons">
            <button class="seeMore" @click="seeMoreInfoAboutRecipe">
                See more
            </button>
            <button class="addToWeekPlan" @click="selectRecipe">
                Add to this week plan
                <i class="las la-arrow-right" style="font-size: 16px"></i>
            </button>
        </div> -->
    </div>
</template>

<script lang="ts">
import { Recipe } from '@/api/types/recipe';
import { computed, defineComponent, PropType } from 'vue';
import useAuthState from '@/store/auth-state';
import useUserState from '@/store/user-state';
import useRecipeState from '@/store/recipe-state';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'RecipeCard',

    props: {
        recipe: {
            type: Object as PropType<Recipe>,
            required: true,
        },
        slim: Boolean,
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
                query: { id: props.recipe._id!, cgb: 'true' },
            });
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
            selectRecipe,
            seeMoreInfoAboutRecipe,
        };
    },
});
</script>

<style scoped>
.card {
    max-width: 400px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    background-color: var(--background-contrast-color);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    height: fit-content;
}
.card.slim {
    display: flex;
    min-height: calc(2rem + 60px);
    border: none;
    border-radius: 0;
    margin: 0;
    border-bottom: 1px solid var(--shadow-color);
    max-width: none;
}
.card.pointer {
    cursor: pointer;
}

.image-container {
    height: 280px;
}
.slim .image-container {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    margin-left: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
}
.image {
    height: 100%;
    border-radius: 1rem;
    margin: 1rem;
    margin-bottom: 0;
}
.slim .image {
    margin: 0;
    border-radius: 0.5rem;
}
.content {
    flex-wrap: wrap;
    min-height: 180px;
}
.slim .content {
    min-height: auto;
}
.head {
    display: flex;
    width: 100%;
    align-items: flex-start;
}
.title {
    width: 100%;
    text-align: left;
    font-family: var(--title-font);
    font-size: 24px;
}
.slim .title {
    font-size: 16px;
}

.details {
    display: flex;
    width: 100%;
    margin-top: 2rem;
    justify-content: flex-end;
    align-self: flex-end;
}
.slim .details {
    margin-top: 0.5rem;
    justify-content: flex-start;
}

.fav {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    margin-left: 2rem;
}
.slim .fav {
    display: none;
}
.fav > i {
    font-size: 32px;
    color: var(--accent-color);
}

.rating {
    display: flex;
    cursor: pointer;
}
.details span {
    font-size: 18px;
    margin-left: 0.5rem;
    color: var(--grey-800);
}
.slim .details span {
    font-size: 14px;
}
.details i {
    color: var(--grey-600);
}
.slim .details i {
    font-size: 16px;
}
.time {
    display: flex;
    margin-left: 2rem;
    min-width: 130px;
    justify-content: flex-end;
}
.slim .rating,
.slim .time {
    align-items: center;
}
.slim .time {
    min-width: auto;
    margin-left: 1rem;
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
