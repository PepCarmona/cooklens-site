<template>
    <div class="title">
        <button @click="back" class="back">
            <ArrowBackIcon size="l" />
        </button>
        <h2>My Week Plan</h2>
    </div>
    <div class="body">
        <div class="selectWeekPlan">
            <div class="input" @click="isDropped = !isDropped">
                <span v-if="selectedWeekPlanIndex === null">New week plan</span>
                <span v-else>{{ weekPlanNames[selectedWeekPlanIndex] }}</span>
                <ArrowDropDownIcon />
            </div>
            <div class="dropDown" v-if="isDropped">
                <ul>
                    <li
                        v-for="(name, index) in weekPlanNames"
                        :key="index"
                        @click="
                            selectedWeekPlanIndex = index;
                            isDropped = false;
                        "
                        :class="{ selected: index === selectedWeekPlanIndex }"
                    >
                        {{ name }}
                    </li>
                    <li
                        @click="
                            selectedWeekPlanIndex = null;
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
                    <div
                        class="lunch"
                        :class="{ free: !dailyPlan.lunch }"
                        @click="showModal('lunch', index)"
                    >
                        <span class="label">Lunch</span>
                        <div class="text" v-if="dailyPlan.lunch">
                            {{ dailyPlan.lunch }}
                        </div>
                        <template v-else> <AddIcon size="xl" /> </template>
                    </div>
                    <div
                        class="dinner"
                        :class="{ free: !dailyPlan.dinner }"
                        @click="showModal('dinner', index)"
                    >
                        <span class="label">Dinner</span>
                        <div class="text" v-if="dailyPlan.dinner">
                            {{ dailyPlan.dinner }}
                        </div>
                        <template v-else> <AddIcon size="xl" /> </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <CustomModal :thin="true" v-if="selectedDay" @close="selectedDay = null">
        {{ weekDays[selectedDay] }} {{ selectedMeal }}
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <RecipeList :recipes="recipes" @goToPage="goToPage" />
        </div>
    </CustomModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import {
    EOS_WEST as ArrowBackIcon,
    EOS_ARROW_DROP_DOWN as ArrowDropDownIcon,
    EOS_ADD as AddIcon,
} from 'eos-icons-vue3';
import { useRouter } from 'vue-router';
import useRecipeState from '@/store/recipe-state';
import { weekDays, fakeWeekPlans, newWeekPlan } from '@/store/weekPlan-state';
import CustomModal from '@/components/shared/CustomModal.vue';
import RecipeList from '@/components/recipes/RecipeList.vue';

type Meals = 'lunch' | 'dinner';

export default defineComponent({
    name: 'MyWeekPlan',

    components: {
        ArrowBackIcon,
        ArrowDropDownIcon,
        AddIcon,
        CustomModal,
        RecipeList,
    },

    setup() {
        const router = useRouter();

        const { searchRecipes, recipes, isLoading } = useRecipeState();

        const isDropped = ref(false);

        const selectedWeekPlanIndex = ref<number | null>(null);
        const selectedMeal = ref<Meals>();
        const selectedDay = ref<number | null>(null);

        const selectedWeekPlan = computed(() =>
            selectedWeekPlanIndex.value === null
                ? newWeekPlan
                : fakeWeekPlans[selectedWeekPlanIndex.value]
        );

        const weekPlanNames = computed(() =>
            fakeWeekPlans.map((weekplan) => weekplan.name)
        );

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
            weekDays,
            isDropped,
            selectedWeekPlanIndex,
            selectedMeal,
            selectedDay,
            selectedWeekPlan,
            recipes,
            isLoading,
            weekPlans: fakeWeekPlans,
            weekPlanNames,
            showModal,
            goToPage,
            back,
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
.selectWeekPlan > .input {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid var(--main-color);
    border-radius: 5px;
    padding: 5px 5px 5px 15px;
    z-index: 9;
    background-color: var(--main-light-color);
}
.selectWeekPlan > .input > span {
    margin-right: 10px;
}
.selectWeekPlan > .dropDown {
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
    background: linear-gradient(
        0deg,
        var(--main-color) 0%,
        var(--secondary-color) 40%,
        var(--third-transparent-color) 100%
    );
    color: var(--main-light-color);
}

.modal {
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    background-color: var(--third-transparent-color);
    z-index: 99;
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
