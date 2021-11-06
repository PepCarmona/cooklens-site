<template>
    <div class="title">
        <button @click="back" class="back">
            <ArrowBackIcon size="l" />
        </button>
        <h2>My Week Plan</h2>
    </div>
    <div class="body">
        <div class="selectWeekPlan">
            <div class="dropDown__selected">
                <input type="text" v-model="selectedWeekPlan.name" />
                <div class="dropDown__button" @click="isDropped = !isDropped">
                    <ArrowDropDownIcon />
                </div>
            </div>
            <div class="dropDown" v-if="isDropped">
                <ul>
                    <li
                        v-for="(weekPlan, index) in myWeekPlans"
                        :key="index"
                        @click="
                            selectWeekPlan(weekPlan._id);
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
                            selectWeekPlan(null);
                            isDropped = false;
                        "
                    >
                        New week plan
                    </li>
                </ul>
            </div>
        </div>
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
                        <div
                            v-if="dailyPlan.lunch"
                            class="text"
                            @click="showRecipeDetails = dailyPlan.lunch"
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
                            @click="showModal('lunch', index)"
                        >
                            <AddIcon size="xl" />
                        </div>
                    </div>
                    <div class="dinner" :class="{ free: !dailyPlan.dinner }">
                        <span class="label">Dinner</span>
                        <div
                            v-if="dailyPlan.dinner"
                            class="text"
                            @click="showRecipeDetails = dailyPlan.lunch"
                        >
                            {{ dailyPlan.dinner.title }}
                        </div>
                        <div
                            v-else
                            class="add"
                            @click="showModal('dinner', index)"
                        >
                            <AddIcon size="xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <CustomModal
        thin
        :mode="'right'"
        v-if="selectedDay !== null"
        @close="selectedDay = null"
    >
        <div class="closeModal-container">
            <button class="closeModal" @click="selectedDay = null">
                <CloseIcon size="l" />
            </button>
        </div>
        <div class="selectedDay">
            {{ weekDays[selectedDay] }} {{ selectedMeal }}
        </div>
        <div class="recipeListContainer">
            <RecipeList
                :recipes="recipes"
                :isWeekPlan="true"
                @goToPage="goToPage"
                @selectedRecipe="
                    addRecipeToWeekPlan($event, selectedDay, selectedMeal);
                    selectedDay = null;
                "
                @seeMoreInfoAboutRecipe="showRecipeDetails = $event"
            />
        </div>
    </CustomModal>
    <CustomModal
        thin
        :mode="'right'"
        v-if="showRecipeDetails !== null"
        @close="
            showRecipeDetails = null;
            selectedDay = null;
        "
    >
        <div class="closeModal-container">
            <button class="closeModal" @click="showRecipeDetails = null">
                <CloseIcon size="l" />
            </button>
        </div>
        <RecipeDetails :id="showRecipeDetails._id" minified />
    </CustomModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import {
    EOS_WEST as ArrowBackIcon,
    EOS_ARROW_DROP_DOWN as ArrowDropDownIcon,
    EOS_ADD as AddIcon,
    EOS_CLOSE as CloseIcon,
} from 'eos-icons-vue3';
import { useRouter } from 'vue-router';
import useRecipeState from '@/store/recipe-state';
import useWeekPlanState, {
    weekDays,
    // fakeWeekPlans as myWeekPlans,
} from '@/store/weekPlan-state';
import CustomModal from '@/components/shared/CustomModal.vue';
import RecipeList from '@/components/recipes/RecipeList.vue';
import { Meals } from '@/api/types/weekPlan';
import { Recipe } from '@/api/types/recipe';
import RecipeDetails from '@/views/RecipeDetails.vue';

export default defineComponent({
    name: 'MyWeekPlan',

    components: {
        ArrowBackIcon,
        ArrowDropDownIcon,
        AddIcon,
        CloseIcon,
        CustomModal,
        RecipeList,
        RecipeDetails,
    },

    setup() {
        const router = useRouter();

        const { searchRecipes, recipes, isLoading, getMainImageUrl } =
            useRecipeState();
        const weekPlanState = useWeekPlanState();

        const isDropped = ref(false);

        const selectedMeal = ref<Meals>();
        const selectedDay = ref<number | null>(null);

        const showRecipeDetails = ref<Recipe | null>(null);

        onMounted(() => weekPlanState.getMyWeekPlans());

        function showModal(meal: Meals, day: number) {
            selectedMeal.value = meal;
            selectedDay.value = day;
            searchRecipes();
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
            showRecipeDetails,
            recipes,
            isLoading,
            showModal,
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

.body {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
}

.selectWeekPlan {
    position: relative;
    width: fit-content;
    max-width: 80%;
    margin-left: auto;
    margin-bottom: 1rem;
    text-align: right;
    cursor: pointer;
}
.dropDown__selected {
    position: relative;
    display: flex;
    align-items: center;
    z-index: 9;
    background-color: var(--main-light-color);
}
.dropDown__selected > input {
    padding: 5px 5px 3px 15px;
    border: none;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    font-size: 1.2rem;
}
.dropDown__button {
    border: 1px solid var(--main-color);
    border-radius: 5px;
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
.meals .label {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    background-color: var(--main-color);
    color: var(--main-light-color);
    padding: 4px 8px;
    border-radius: 5px;
    font-size: 0.8rem;
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

/* .selectedDay {
    width: 100%;
} */

.recipeListContainer {
    height: 100%;
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
</style>
