<template>
    <footer>
        <button
            @click="addRecipe"
            v-if="showAddRecipe || showEditRecipe"
            class="add-recipe"
        >
            <i v-if="showAddRecipe" class="las la-plus"></i>
            <i v-if="showEditRecipe" class="las la-pen"></i>
        </button>
        <div id="mobile-sticky-footer">
            <div>
                <router-link to="/">
                    <i
                        class="las la-home"
                        :class="{ current: routeName === 'Home' }"
                    ></i>
                </router-link>
            </div>
            <div :class="{ 'mr-2': showAddRecipe || showEditRecipe }">
                <router-link to="/recipes">
                    <i
                        class="las la-search"
                        :class="{ current: routeName === 'RecipesMainView' }"
                    ></i>
                </router-link>
            </div>
            <div :class="{ 'ml-2': showAddRecipe || showEditRecipe }">
                <router-link to="/profile/myWeekPlan">
                    <i
                        class="las la-calendar-week"
                        :class="{ current: routeName === 'myWeekPlan' }"
                    ></i>
                </router-link>
            </div>
            <div>
                <router-link to="/profile">
                    <i
                        class="las la-user-circle"
                        :class="{
                            current: ['Authentication', 'Profile'].includes(
                                routeName
                            ),
                        }"
                    ></i>
                </router-link>
            </div>
        </div>
    </footer>
</template>

<script lang="ts">
import useRecipeState from '@/store/recipe-state';
import { computed, defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    name: 'Footer',

    setup() {
        const route = useRoute();
        const router = useRouter();

        const { isLoading, isOwnRecipe, recipe } = useRecipeState();

        const routeName = computed(() => route.name);

        const showAddRecipe = computed(
            () =>
                route.name &&
                ['Home', 'RecipesMainView', 'myRecipes'].includes(
                    route.name.toString()
                )
        );

        const showEditRecipe = computed(
            () =>
                !isLoading.value &&
                route.name === 'RecipeDetails' &&
                isOwnRecipe.value
        );

        function addRecipe() {
            if (showAddRecipe.value) {
                router.push({
                    name: 'CreateRecipe',
                });
                return;
            }
            if (showEditRecipe.value) {
                router.push({
                    name: 'CreateRecipe',
                    query: { edit: recipe.value._id },
                });
            }
        }
        return {
            routeName,
            showAddRecipe,
            showEditRecipe,
            addRecipe,
        };
    },
});
</script>

<style scoped>
footer {
    z-index: 10;
}
i {
    color: black;
}
i.current {
    color: var(--accent-color);
}
.add-recipe {
    position: fixed;
    bottom: calc(1rem - 1px);
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--accent-color);
    box-shadow: 0px -1px 0px var(--shadow-color);
    border-radius: 60px;
    height: 60px;
    width: 60px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}
.add-recipe > i {
    margin-bottom: 0.5rem;
    padding-top: 0.5rem;
    color: var(--inverted-text-color);
}

#mobile-sticky-footer {
    display: flex;
    width: 100%;
    height: 55px;
    align-items: center;
    position: fixed;
    bottom: -1px;
    left: 0;
    background-color: var(--background-contrast-color);
    box-shadow: 0px -1px 0px var(--shadow-color);
    z-index: 99;
}
#mobile-sticky-footer > div {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    width: 25%;
    align-items: center;
    justify-content: center;
}
#mobile-sticky-footer > div > * {
    width: 100%;
}

@media only screen and (min-width: 769px) {
    #mobile-sticky-footer,
    .add-recipe {
        display: none;
    }
}
</style>
