<template>
    <div class="title">
        <button @click="back" class="back">
            <i class="las la-arrow-left"></i>
        </button>
        <h2>My Week Plan</h2>
    </div>
    <div class="header">
        <div class="selectWeekPlan">
            <div class="dropDown__selected">
                <input
                    type="text"
                    v-model="selectedWeekPlan.name"
                    placeholder="New Week Plan"
                />
                <div class="dropDown__button" @click="isDropped = !isDropped">
                    <i class="las la-caret-down" style="font-size: 16px"></i>
                </div>
            </div>
            <div
                v-if="!isNameValid && hasSelectedWeekPlanChanged"
                class="errors"
            >
                * Invalid Name
            </div>
            <div class="dropDown" v-if="isDropped">
                <ul>
                    <li
                        v-for="(weekPlan, index) in myWeekPlans"
                        :key="index"
                        @click="
                            selectWeekPlan(weekPlan);
                            isDropped = false;
                        "
                        :class="{
                            selected: weekPlan._id === selectedWeekPlan._id,
                        }"
                    >
                        {{ weekPlan.name }}
                    </li>
                    <li
                        @click="
                            selectWeekPlan(undefined);
                            isDropped = false;
                        "
                    >
                        New week plan
                    </li>
                </ul>
            </div>
        </div>
        <button
            class="save"
            :class="{ disabled: !hasSelectedWeekPlanChanged || !isNameValid }"
            @click="saveWeekPlan(selectedWeekPlan)"
        >
            <i class="las la-save"></i>
            <span>Save</span>
        </button>
        <button
            class="remove"
            :class="{ disabled: isNewWeekPlan }"
            @click="deleteWeekPlan(selectedWeekPlan)"
        >
            <i class="las la-trash-alt"></i>
            <span>Delete</span>
        </button>
    </div>
    <div class="body">
        <div class="weekPlan">
            <div
                class="day"
                v-for="(dailyPlan, index) in selectedWeekPlan.dailyPlans"
                :key="index"
            >
                <div class="dayName">
                    {{ weekDays[index] }}
                </div>
                <div class="meals">
                    <div class="lunch" :class="{ free: !dailyPlan.lunch }">
                        <span class="label">Lunch</span>
                        <span
                            v-if="dailyPlan.lunch"
                            class="remove-label"
                            @click="removeRecipeFromWeekPlan(index, 'lunch')"
                        >
                            <i
                                class="las la-trash-alt"
                                style="color: white"
                            ></i>
                        </span>
                        <div
                            v-if="dailyPlan.lunch"
                            class="text"
                            @click="showRecipeDetails(dailyPlan.lunch)"
                            :style="`background: 
                                linear-gradient(
                                    0deg,
                                    var(--main-color) 0%,
                                    var(--third-transparent-color) 100%
                                ),
                                url(${getMainImageUrl(
                                    dailyPlan.lunch
                                )}) center center / cover;`"
                        >
                            {{ dailyPlan.lunch.title }}
                        </div>
                        <div
                            v-else
                            class="add"
                            @click="showRecipeList('lunch', index)"
                        >
                            <i class="las la-plus" style="font-size: 48px"></i>
                        </div>
                    </div>
                    <div class="dinner" :class="{ free: !dailyPlan.dinner }">
                        <span class="label">Dinner</span>
                        <span
                            v-if="dailyPlan.dinner"
                            class="remove-label"
                            @click="removeRecipeFromWeekPlan(index, 'dinner')"
                        >
                            <i
                                class="las la-trash-alt"
                                style="color: white"
                            ></i>
                        </span>
                        <div
                            v-if="dailyPlan.dinner"
                            class="text"
                            @click="showRecipeDetails(dailyPlan.lunch)"
                            :style="`background: 
                                linear-gradient(
                                    0deg,
                                    var(--main-color) 0%,
                                    var(--third-transparent-color) 100%
                                ),
                                url(${getMainImageUrl(
                                    dailyPlan.dinner
                                )}) center center / cover;`"
                        >
                            {{ dailyPlan.dinner.title }}
                        </div>
                        <div
                            v-else
                            class="add"
                            @click="showRecipeList('dinner', index)"
                        >
                            <i class="las la-plus" style="font-size: 48px"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <CustomModal
        thin
        :mode="'right'"
        v-if="modalMode !== null"
        @close="modalMode = null"
    >
        <div class="recipeList" v-if="modalMode === 'recipeList'">
            <div class="closeModal-container">
                <button class="closeModal" @click="modalMode = null">
                    <i class="las la-times"></i>
                </button>
            </div>
            <button
                class="createRecipeButon"
                @click="modalMode = 'createRecipe'"
            >
                Add new recipe
            </button>
            <div class="recipeListContainer">
                <!-- <SearchRecipe /> -->
                <RecipeList
                    thin
                    :recipes="recipes"
                    :isWeekPlan="true"
                    @goToPage="goToPage"
                    @selectedRecipe="
                        addRecipeToWeekPlan($event, selectedDay, selectedMeal);
                        modalMode = null;
                    "
                    @seeMoreInfoAboutRecipe="showRecipeDetails($event, true)"
                />
            </div>
        </div>
        <div class="recipeDetails" v-if="modalMode === 'recipeDetails'">
            <div class="closeModal-container">
                <button
                    v-if="canGoBack"
                    class="closeModal"
                    @click="modalMode = 'recipeList'"
                >
                    <i class="las la-arrow-left"></i>
                </button>
                <button v-else class="closeModal" @click="modalMode = null">
                    <i class="las la-times"></i>
                </button>
            </div>
            <RecipeDetails :id="detailedRecipe._id" minified />
        </div>
        <div class="createRecipe" v-if="modalMode === 'createRecipe'">
            <div class="closeModal-container">
                <button class="closeModal" @click="modalMode = 'recipeList'">
                    <i class="las la-times"></i>
                </button>
            </div>
            <CreateRecipe
                thin
                @newRecipeSaved="
                    addRecipeToWeekPlan($event, selectedDay, selectedMeal)
                "
            />
        </div>
    </CustomModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import useRecipeState from '@/store/recipe-state';
import useWeekPlanState, { weekDays } from '@/store/weekPlan-state';
import CustomModal from '@/components/shared/CustomModal.vue';
import RecipeList from '@/components/recipes/RecipeList.vue';
import { Meals } from '@/api/types/weekPlan';
import { Recipe } from '@/api/types/recipe';
import RecipeDetails from '@/views/RecipeDetails.vue';
import CreateRecipe from '@/components/recipes/CreateRecipe.vue';

type modalModes = 'recipeList' | 'recipeDetails' | 'createRecipe' | null;

export default defineComponent({
    name: 'MyWeekPlan',

    components: {
        CustomModal,
        RecipeList,
        RecipeDetails,
        CreateRecipe,
        // SearchRecipe,
    },

    setup() {
        const router = useRouter();

        const { searchRecipes, recipes, isLoading, getMainImageUrl } =
            useRecipeState();
        const weekPlanState = useWeekPlanState();

        const isDropped = ref(false);

        const selectedMeal = ref<Meals>();
        const selectedDay = ref<number | null>(null);

        const detailedRecipe = ref<Recipe>();

        const modalMode = ref<modalModes>(null);
        const canGoBack = ref(false);

        onMounted(() =>
            weekPlanState.getMyWeekPlans().then((weekPlans) => {
                if (weekPlans.length > 0) {
                    weekPlanState.selectWeekPlan(weekPlans[0]);
                }
            })
        );

        function showRecipeList(meal: Meals, day: number) {
            modalMode.value = 'recipeList';
            selectedMeal.value = meal;
            selectedDay.value = day;
            searchRecipes();
        }

        function showRecipeDetails(recipe: Recipe, back?: boolean) {
            modalMode.value = 'recipeDetails';
            detailedRecipe.value = recipe;

            canGoBack.value = !!back;
        }

        function goToPage(page: number) {
            searchRecipes(page);
        }

        function back() {
            router.push({
                name: 'Profile',
            });
        }

        return {
            ...weekPlanState,
            weekDays,
            isDropped,
            selectedMeal,
            selectedDay,
            detailedRecipe,
            modalMode,
            canGoBack,
            recipes,
            isLoading,
            showRecipeList,
            showRecipeDetails,
            goToPage,
            back,
            getMainImageUrl,
        };
    },
});
</script>

<style scoped>
.back {
    padding: 0.5rem 1rem;
    position: absolute;
    left: 1rem;
}

.title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
}

.body,
.header {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
}

.header {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin-bottom: 1rem;
}

.save,
.remove {
    padding: 5px 5px 3px 5px;
    margin-left: 1rem;
    border: 1px solid var(--main-color);
    border-radius: 3px;
}
.save > span,
.remove > span {
    font-size: 1rem;
    margin-left: 0.5rem;
}

.save.disabled,
.remove.disabled {
    opacity: 0.4;
    pointer-events: none;
}

.remove {
    color: var(--error-color);
    border-color: var(--error-color);
}
.remove:hover {
    background-color: var(--light-error-color);
}
.remove > i {
    color: var(--error-color);
}

.errors {
    color: var(--error-color);
    font-size: 0.7rem;
    position: absolute;
    bottom: -14px;
    left: 15px;
    cursor: default;
}

.selectWeekPlan {
    position: relative;
    width: fit-content;
    width: 100%;
    margin-bottom: 0.5rem;
    text-align: right;
    cursor: pointer;
}
.dropDown__selected {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 9;
    background-color: var(--main-light-color);
    border: 1px solid var(--main-color);
    border-radius: 3px;
}
.dropDown__selected > input {
    width: 100%;
    padding: 5px 5px 3px 15px;
    border: none;
    border-radius: 3px;
    font-size: 1.2rem;
}
.dropDown__selected > input:focus {
    outline: none;
}
.dropDown {
    position: absolute;
    right: 0;
    background-color: var(--secondary-color);
    width: 100%;
    margin-top: -3px;
    border: 1px solid var(--main-color);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    z-index: 9;
}
.selectWeekPlan > .dropDown li {
    padding: 4px 6px;
}
.selectWeekPlan > .dropDown li.selected {
    background-color: var(--main-light-color);
}
.selectWeekPlan > .dropDown li:hover {
    background-color: var(--secondary-light-color);
}
.selectWeekPlan > .dropDown li:last-child:hover {
    background-color: var(--secondary-light-color);
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
}
.selectWeekPlan > .dropDown li:first-child {
    margin-top: 2px;
}

.weekPlan {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 20px;
    border: 1px solid var(--main-color);
    border-radius: 5px;
    box-shadow: inset 0px 0px 15px -8px var(--main-color);
    background-color: var(--secondary-color);
}

.day {
    width: 100%;
    border: 1px solid var(--main-color);
    border-radius: 5px;
    background-color: var(--secondary-light-color);
}
.day:not(:last-child) {
    margin-bottom: 10px;
}
.dayName {
    border-bottom: 1px solid var(--main-color);
    padding: 5px 0;
}
.meals {
    padding: 10px 0;
    background-color: var(--main-light-color);
}
.meals > div {
    position: relative;
    display: flex;
    border: 1px solid var(--main-color);
    border-radius: 5px;
    width: 250px;
    height: 200px;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--secondary-light-color);
    cursor: pointer;
}
.meals > div:not(:last-child) {
    margin-bottom: 10px;
}
.meals > div.free {
    align-items: center;
    justify-content: center;
}
.meals .label,
.meals .remove-label {
    position: absolute;
    top: 0.5rem;
    background-color: var(--main-color);
    color: var(--main-light-color);
    border-radius: 5px;
    font-size: 0.8rem;
}
.meals .label {
    left: 0.5rem;
    padding: 4px 8px;
}
.meals .remove-label {
    display: flex;
    right: 0.5rem;
    padding: 2px;
}
.meals .text {
    display: flex;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    padding: 20px 10px;
    /* background: linear-gradient(
        0deg,
        var(--main-color) 0%,
        var(--secondary-color) 40%,
        var(--third-transparent-color) 100%
    ); */
    background-size: cover;
    color: var(--main-light-color);
}
.meals .add {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal {
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    background-color: var(--third-transparent-color);
    z-index: 99;
}

.recipeListContainer {
    display: flex;
    flex-direction: column;
}

.closeModal-container {
    width: 100%;
}
.closeModal {
    margin-left: auto;
    margin-right: 0;
}
.closeModal:hover {
    background-color: transparent;
}

@media only screen and (min-width: 768px) {
    .header {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;
    }

    .selectWeekPlan {
        width: auto;
        margin-bottom: 0;
    }

    .weekPlan {
        flex-wrap: nowrap;
        overflow-x: auto;
        min-height: 550px;
    }

    .day {
        min-width: 200px;
        display: flex;
        flex-direction: column;
    }
    .day:not(:last-child) {
        margin-right: 5px;
        margin-bottom: 0;
    }

    .meals {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        justify-content: space-evenly;
    }
    .meals > div {
        width: 180px;
        height: 150px;
    }
    .meals > div:not(:last-child) {
        margin-bottom: 0px;
    }
}
.recipeList {
    height: 100%;
}

.createRecipeButon {
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--main-color);
    font-size: 1rem;
    margin-top: 0.5rem;
    margin-bottom: 2rem;
}
</style>
