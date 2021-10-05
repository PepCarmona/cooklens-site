<template>
    <div>
        <CreateRecipe
            v-if="showEditRecipe"
            :recipe="recipe"
            @saved="hideEdit"
            @cancel="hideEdit"
        />
        <template v-else>
            <CustomModal v-if="isLoading">
                <LoadingModal>Loading ...</LoadingModal>
            </CustomModal>
            <div class="container" v-else>
                <div
                    class="recipe-title mt-2"
                    :class="{ 'mb-2': recipeHasImages }"
                >
                    <h1 class="w-100 m-0">{{ recipe.title }}</h1>
                    <button @click="showEditRecipe = true">
                        <EditIcon size="l" color="grey" />
                    </button>
                </div>
                <div class="recipe-info">
                    <div v-if="recipe.author">
                        By: {{ recipe.author.username }}
                    </div>
                    <div v-if="recipe.url">
                        Imported from
                        <a
                            :href="recipe.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            >{{ formattedURL }}</a
                        >
                    </div>
                </div>
                <div
                    class="gallery-and-icons"
                    :class="{ 'mb-2': !recipeHasImages }"
                >
                    <div v-if="recipeHasImages" class="gallery" ref="gallery">
                        <img :src="img" :alt="recipe.title" />
                    </div>
                    <div class="icons" :class="{ responsive: recipeHasImages }">
                        <button @click="toggleFavRecipe(recipe)">
                            <FavFilledIcon
                                v-if="isFavoriteRecipe(recipe)"
                                size="l"
                                color="grey"
                            />
                            <FavIcon v-else size="l" color="grey" />
                        </button>
                        <button><CalendarIcon size="l" color="grey" /></button>
                        <button><ShareIcon size="l" color="grey" /></button>
                    </div>
                </div>
                <div class="mt-1">{{ recipe.description }}</div>
                <ul class="time mt-3 p-2">
                    <li v-if="recipe.time.preparation">
                        <b>Prep:</b>
                        {{ getFormattedTime(recipe.time.preparation) }}
                    </li>
                    <li>
                        <b>Cook :</b>
                        {{ getFormattedTime(recipe.time.cooking) }}
                    </li>
                    <li>
                        <b>Total:</b>
                        {{ totalTime }}
                    </li>
                    <li><b>Servings:</b> {{ recipe.servings }}</li>
                    <div class="icon">
                        <ClockIcon size="xl" color="grey" />
                    </div>
                </ul>
                <div class="section-title">
                    <span>Ingredients</span>
                    <CustomNumberInput
                        v-if="canModifyServings"
                        class="modifyServingsInput"
                        :id="'servingsInput'"
                        :min="1"
                        v-model="modifiedServings"
                    />
                </div>
                <ul class="ingredients">
                    <li
                        v-for="ingredient in ingredientsToShow"
                        :key="ingredient._id"
                    >
                        <span class="check">
                            <input type="checkbox" />
                        </span>
                        <span
                            v-if="
                                ingredient.quantity && ingredient.quantity > 0
                            "
                        >
                            {{ ingredient.quantity }}
                        </span>
                        <span>{{ ingredient.units }}</span>
                        <span>{{ ingredient.name }}</span>
                    </li>
                </ul>
                <div class="section-title">Instructions</div>
                <ul class="instructions">
                    <li
                        class="d-flex"
                        v-for="step in recipe.instructions"
                        :key="step._id"
                    >
                        <div class="stepPosition">
                            {{ step.position }}
                        </div>
                        <div class="stepContent">{{ step.content }}</div>
                    </li>
                </ul>
                <h3 v-if="recipe.tags.length > 0">Tags:</h3>
                <ul class="tags d-flex">
                    <li class="pill" v-for="tag in recipe.tags" :key="tag._id">
                        {{ tag.value }}
                    </li>
                </ul>
                <div class="mt-4 d-flex-center">
                    <Rating :recipeRating="recipe.rating" @rate="editRating" />
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { Ingredient } from '@/api/types/recipe';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CustomModal from '@/components/shared/CustomModal.vue';
import LoadingModal from '@/components/shared/LoadingModal.vue';
import CustomNumberInput from '@/components/shared/CustomNumberInput.vue';
import {
    EOS_MODE_EDIT_OUTLINED as EditIcon,
    EOS_FAVORITE_OUTLINED as FavIcon,
    EOS_FAVORITE_FILLED as FavFilledIcon,
    EOS_SHARE as ShareIcon,
    EOS_TODAY_OUTLINED as CalendarIcon,
    EOS_SCHEDULE_OUTLINED as ClockIcon,
} from 'eos-icons-vue3';
import CreateRecipe from '@/components/CreateRecipe.vue';
import Rating from '@/components/shared/Rating.vue';
import useRecipeState from '@/store/recipe-state';
import useUserState from '@/store/user-state';

export default defineComponent({
    name: 'RecipeDetails',

    components: {
        CustomModal,
        LoadingModal,
        CustomNumberInput,
        EditIcon,
        FavIcon,
        FavFilledIcon,
        CalendarIcon,
        ShareIcon,
        ClockIcon,
        CreateRecipe,
        Rating,
    },

    setup() {
        const {
            isLoading,
            canModifyServings,
            modifiedServings,
            isFavoriteRecipe,
            getRecipe,
            recipe,
            editRating,
        } = useRecipeState();
        const { toggleFavRecipe } = useUserState();

        const route = useRoute();
        const router = useRouter();

        const gallery = ref<HTMLDivElement>();

        // TODO: remove when real images are added
        const imgHeight = ref(0);
        const imgWidth = ref(0);

        const showEditRecipe = ref(false);

        const data = {
            isLoading,
            recipe,
            canModifyServings,
            modifiedServings,
            isFavoriteRecipe,
            toggleFavRecipe,
            gallery,
            showEditRecipe,
        };

        onMounted(() => {
            if (route.query.random) {
                getRandomRecipe();
            } else {
                getRecipeDetails();
            }

            setTimeout(() => {
                imgWidth.value = Math.ceil(gallery.value?.offsetWidth || 0);
                imgHeight.value = Math.ceil(imgWidth.value / 1.33);
            }, 100);

            window.addEventListener('resize', () => {
                imgWidth.value = Math.ceil(gallery.value?.offsetWidth || 0);
                imgHeight.value = Math.ceil(imgWidth.value / 1.33);
            });
        });

        watch(route, () => {
            if (route.query.random) {
                getRandomRecipe();
            }
        });

        // TODO: Remove once real images are added
        const img = computed(
            () =>
                `https://via.placeholder.com/${imgWidth.value}x${imgHeight.value}.webp`
        );

        const ingredientsToShow = computed(() => {
            if (canModifyServings.value) {
                const clonedIngredients: Ingredient[] = JSON.parse(
                    JSON.stringify(recipe.value.ingredients)
                );
                return clonedIngredients.map((ingredient) => {
                    if (ingredient.quantity) {
                        ingredient.quantity =
                            (ingredient.quantity / recipe.value.servings) *
                            modifiedServings.value!;
                    }

                    return ingredient;
                });
            }

            return recipe.value.ingredients;
        });

        const recipeHasImages = computed(
            () => recipe.value.images && recipe.value.images.length > 0
        );

        const totalTime = computed(() => {
            return getFormattedTime(
                (recipe.value.time.preparation ?? 0) + recipe.value.time.cooking
            );
        });

        const formattedURL = computed(
            () => new URL(recipe.value.url!).hostname
        );

        function getRecipeDetails() {
            const id = route.query.id?.toString();

            if (!id) {
                console.error('ID not provided');
                return;
            }

            getRecipe(id).catch((err) => {
                console.error(err);
                // TODO: show custom error page && display error on floating modal
                router.push({
                    name: 'RecipesMainView',
                });
            });
        }

        function getRandomRecipe() {
            useRecipeState()
                .getRandomRecipe()
                .then(() => {
                    const formattedTitle = recipe.value.title
                        .toLowerCase()
                        .replaceAll(' ', '-');

                    router.push({
                        name: 'RecipeDetails',
                        params: { title: formattedTitle },
                        query: { id: recipe.value._id },
                    });
                })
                .catch((err) => {
                    console.error(err);
                    router.push({
                        name: 'RecipesMainView',
                    });
                });
        }

        function getFormattedTime(time: number) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;

            const formattedTime =
                hours > 0 ? `${hours} h  ${minutes} min` : `${minutes} min`;

            return formattedTime;
        }

        function hideEdit() {
            showEditRecipe.value = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        return {
            ...data,
            img,
            ingredientsToShow,
            totalTime,
            formattedURL,
            getFormattedTime,
            recipeHasImages,
            editRating,
            hideEdit,
        };
    },
});
</script>

<style scoped>
.container > * {
    width: 100%;
}
.container * {
    text-align: left;
}

.recipe-title {
    display: flex;
}
.recipe-title > button {
    height: fit-content;
    padding: 0.5rem;
    margin-top: 10px;
}

.recipe-info {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    padding-right: 60px;
}

.gallery-and-icons {
    position: relative;
}
.icons {
    display: flex;
}
.icons > button {
    border: 1px solid grey;
    border-radius: 2px;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1.6rem;
    padding-right: 1.6rem;
    margin: 0.5rem;
}
.icons > button:first-child {
    margin-left: 0;
}

.time {
    position: relative;
    border: 2px solid lightgrey;
    border-radius: 2px;
    padding-left: 1.5rem !important;
}
.time > li {
    margin-top: 2rem;
}
.time > li:first-child {
    margin-top: 0;
}
.time > .icon {
    position: absolute;
    top: -10px;
    right: -10px;
    padding: 5px;
    background-color: white;
    width: 42px;
    height: 42px;
}

.section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-top: 2px solid lightgrey;
    padding-top: 2rem;
    margin-bottom: 1rem;
    margin-top: 3rem;
    font-size: 1.6rem;
    font-weight: bold;
}

.modifyServingsInput {
    width: 100px;
}
.ingredients > li {
    display: flex;
    margin-bottom: 1rem;
}
.ingredients .check {
    margin-right: 0.4rem;
}

.instructions > li {
    margin-bottom: 2rem;
}
.instructions > li:last-child,
.ingredients > li:last-child {
    margin-bottom: 0;
}
.stepPosition {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    width: 25px;
    line-height: 25px;
    /* background-color: grey;
    color: white; */
    border: 1px solid grey;
    color: grey;
    border-radius: 2px;
    /* font-size: 0.8rem; */
}
.stepContent {
    width: calc(100% - 20px - 1rem);
    margin-left: 1rem;
}

.pill {
    background-color: grey;
    color: white;
    border-radius: 50px;
    width: fit-content;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
}

@media only screen and (min-width: 350px) {
    .icons > button {
        border: 1px solid grey;
        border-radius: 2px;
        padding-top: 0.6rem;
        padding-bottom: 0.6rem;
        padding-left: 2rem;
        padding-right: 2rem;
        margin: 0.5rem;
    }
}
@media only screen and (min-width: 767px) {
    .recipe-title > h1 {
        font-size: 2.8rem;
    }
}
@media only screen and (min-width: 769px) {
    .container {
        width: 70%;
    }
    .container > * {
        width: 70%;
    }

    .icons.responsive {
        position: absolute;
        top: -0.5rem;
        right: -90px;
        width: 90px;
        flex-wrap: wrap;
    }
    .icons.responsive > button:first-child {
        margin-left: 0.5rem;
    }
}
</style>
