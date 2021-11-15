<template>
    <div>
        <CreateRecipe
            v-if="showEditRecipe"
            :recipe="recipe"
            @saved="hideEdit"
            @cancel="hideEdit"
        />
        <template v-else>
            <CustomModal v-if="isLoading && !id">
                <LoadingModal>Loading ...</LoadingModal>
            </CustomModal>
            <div class="container" :class="{ thin: !!id }" v-else>
                <div v-if="isLoading & !!id">Loading...</div>
                <template v-else>
                    <div class="gallery-and-icons">
                        <div class="back">
                            <i class="las la-angle-left"></i>
                        </div>
                        <div
                            v-if="recipeHasImages"
                            class="gallery"
                            ref="gallery"
                        >
                            <div
                                class="image"
                                :style="`background: url(${recipe.images[0]}) center center / cover;`"
                            ></div>
                        </div>
                        <div
                            class="icons"
                            :class="{ 'no-image': !recipeHasImages }"
                        >
                            <button
                                class="editButton"
                                v-if="isOwnedRecipe"
                                @click="showEditRecipe = true"
                            >
                                <i class="las la-pen"></i>
                            </button>
                            <button @click="toggleFavRecipe(recipe)">
                                <i
                                    v-if="isFavoriteRecipe(recipe)"
                                    class="las la-heart"
                                ></i>
                                <i v-else class="lar la-heart"></i>
                            </button>
                            <button>
                                <i class="las la-calendar-week"></i>
                            </button>
                            <button>
                                <i class="las la-share-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div
                        class="brief"
                        :class="{ 'no-image': !recipeHasImages }"
                    >
                        <div class="title">
                            <h1>{{ recipe.title }}</h1>
                        </div>
                        <div v-if="recipe.url" class="imported-url">
                            Imported from
                            <a
                                :href="recipe.url"
                                target="_blank"
                                rel="noopener noreferrer"
                                >{{ formattedURL }}</a
                            >
                        </div>
                        <div v-if="recipe.author" class="author">
                            By: {{ recipe.author.username }}
                        </div>
                        <div class="basic-info">
                            <div class="time">
                                <i class="las la-clock"></i>
                                <span>{{ totalTime }}</span>
                            </div>
                            <div class="vertical-separator"></div>
                            <div class="difficulty">
                                <i class="las la-concierge-bell"></i>
                                <span>Easy</span>
                            </div>
                            <div class="vertical-separator"></div>
                            <div class="servings">
                                <i class="las la-utensils"></i>
                                <span>Serves {{ recipe.servings }}</span>
                            </div>
                        </div>
                    </div>
                    <div
                        class="recipe-info"
                        :class="{ 'mb-2': recipeHasImages }"
                    >
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
                    <div v-if="!minified" class="mt-1">
                        {{ recipe.description }}
                    </div>
                    <router-link
                        v-else
                        :to="{
                            name: 'RecipeDetails',
                            params: { title: 'getFormattedTitle(recipe)' },
                            query: { id: recipe._id },
                        }"
                        target="_blank"
                        class="goToPageLink"
                    >
                        Go to recipe page
                    </router-link>
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
                                    ingredient.quantity &&
                                    ingredient.quantity > 0
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
                        <li
                            class="pill"
                            v-for="tag in recipe.tags"
                            :key="tag._id"
                        >
                            {{ tag.value }}
                        </li>
                    </ul>
                    <div v-if="!minified" class="mt-4 d-flex-center">
                        <Rating
                            :recipeRating="recipe.rating"
                            @rate="editRating"
                        />
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { Ingredient, Recipe } from '@/api/types/recipe';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CustomModal from '@/components/shared/CustomModal.vue';
import LoadingModal from '@/components/shared/LoadingModal.vue';
import CustomNumberInput from '@/components/shared/CustomNumberInput.vue';
import CreateRecipe from '@/components/recipes/CreateRecipe.vue';
import Rating from '@/components/shared/Rating.vue';
import useRecipeState from '@/store/recipe-state';
import useUserState from '@/store/user-state';
import useAuthState from '@/store/auth-state';
import { User } from '@/api/types/user';

export function getFormattedTitle(recipe: Recipe): string {
    return recipe.title.toLowerCase().replaceAll(' ', '-');
}

export default defineComponent({
    name: 'RecipeDetails',

    props: {
        id: String,
        minified: Boolean,
    },

    components: {
        CustomModal,
        LoadingModal,
        CustomNumberInput,
        CreateRecipe,
        Rating,
    },

    setup(props) {
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
        const { authenticatedUser } = useAuthState();

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

        const isOwnedRecipe = computed(
            () =>
                recipe.value.author &&
                authenticatedUser.value?._id ===
                    (recipe.value.author as User)._id
        );

        function getRecipeDetails() {
            const id = props.id ?? route.query.id?.toString();

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
            isOwnedRecipe,
            getFormattedTime,
            recipeHasImages,
            editRating,
            hideEdit,
            getFormattedTitle,
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

.brief {
    background-color: var(--background-contrast-color);
    border-radius: 1rem;
    padding: 1rem;
    margin: 1rem;
    margin-top: -50px;
    z-index: 9;
}
.brief.no-image {
    margin-top: calc(2rem + 50px);
}
.title,
.author,
.imported-url {
    width: 100%;
}
.author,
.imported-url,
.imported-url a {
    font-size: 12px;
}
.title > h1 {
    font-family: var(--title-font);
    font-size: 24px;
    margin: 0;
}
.basic-info {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 1rem;
    padding-bottom: 0.5rem;
    margin-top: 2rem;
}
.basic-info > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.basic-info i {
    color: var(--accent-color);
}
.basic-info span {
    width: 100%;
    text-align: center;
}
.vertical-separator {
    border-left: 1px solid rgba(0, 0, 0, 0.1);
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
.image {
    width: 100%;
    height: 400px;
    margin-top: -50px;
}
.back {
    position: absolute;
    left: 1rem;
    top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background-contrast-color);
    border-radius: 50px;
    height: 50px;
    width: 50px;
}
.icons {
    position: absolute;
    display: flex;
    flex-direction: column;
    right: 1rem;
    top: 1rem;
}
.icons.no-image {
    flex-direction: row;
}
.icons > button {
    background-color: var(--background-contrast-color);
    border-radius: 50px;
    height: 50px;
    width: 50px;
    margin-bottom: 1rem;
}
.icons.no-image > button:not(:last-child) {
    margin-right: 1rem;
}
.icons i {
    color: var(--accent-color);
}
.editButton > i {
    color: var(--main-text-color);
}

.section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-top: 2px solid var(--secondary-color);
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
    border: 1px solid var(--main-color);
    color: var(--main-color);
    border-radius: 2px;
}
.stepContent {
    width: calc(100% - 20px - 1rem);
    margin-left: 1rem;
}

.pill {
    background-color: var(--main-color);
    color: var(--main-light-color);
    border-radius: 50px;
    width: fit-content;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
}

@media only screen and (min-width: 769px) {
    .container:not(.thin) {
        width: 70%;
    }
    .container:not(.thin) > * {
        width: 70%;
    }
    .brief {
        width: 600px;
        margin-left: auto;
        margin-right: auto;
        min-height: 200px;
    }
    .brief.no-image {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: 1rem;
    }

    .icons.no-image {
        flex-direction: column;
    }
}
</style>
