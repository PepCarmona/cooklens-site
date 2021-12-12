import { getLastItem } from '@/helpers/array';
import { Recipe } from '@/recipes/types/RecipeTypes';
import {
    CalendarBoundaries,
    Day,
    Week,
    WeekDay,
} from '@/shared/Calendar/CalendarTypes';
import dayjs from 'dayjs';
import { computed, readonly, ref } from 'vue';
import { DayMeal, DayPlan, Meal, meals } from './MealPlanTypes';

const selectedDay = ref<Day>(new WeekDay(new Date()));

const dayPlan = ref<DayPlan>({
    date: selectedDay.value.date,
    meals: [],
});

const isAddingMeal = ref(false);
const isAddingRecipeToMeal = ref(false);

const areAllMealsAdded = computed(() =>
    meals.every((meal) =>
        dayPlan.value.meals.some((dayMeal) => dayMeal.meal === meal)
    )
);

function newDayPlan() {
    dayPlan.value.date = selectedDay.value.date;
    dayPlan.value.meals = [];
}

function addRecipeToMeal(meal: Meal, recipe: Recipe) {
    dayPlan.value.meals.push({
        meal,
        recipe,
    });

    isAddingMeal.value = false;
    isAddingRecipeToMeal.value = false;
}

function removeMeal(dayMeal: DayMeal) {
    const index = dayPlan.value.meals.findIndex(
        (meal) => meal.meal === dayMeal.meal
    );

    if (index === -1) {
        return;
    }

    dayPlan.value.meals.splice(index, 1);
}

function getCalendarBoundaries(weeks: Week[]): CalendarBoundaries {
    const firstDay = weeks[0].filter((day) => day !== null)[0] as Day;
    const lastDay = getLastItem(
        getLastItem(weeks).filter((day) => day !== null) as Day[]
    );

    return {
        startDate: dayjs(firstDay.date).toDate(),
        endDate: dayjs(lastDay.date).toDate(),
    };
}

export default function useMealPlanState() {
    return {
        selectedDay: readonly(selectedDay),
        dayPlan: readonly(dayPlan),
        isAddingMeal: readonly(isAddingMeal),
        isAddingRecipeToMeal: readonly(isAddingRecipeToMeal),
        areAllMealsAdded: readonly(areAllMealsAdded),

        getCalendarBoundaries,
        newDayPlan,
        addRecipeToMeal,
        removeMeal,
        selectDay: (day: Day) => (selectedDay.value = day),
        openMealSelector: () => (isAddingMeal.value = true),
        closeMealSelector: () => {
            isAddingMeal.value = false;
            isAddingRecipeToMeal.value = false;
        },
        openRecipeSelector: () => (isAddingRecipeToMeal.value = true),
        closeRecipeSelector: () => (isAddingRecipeToMeal.value = false),
    };
}
