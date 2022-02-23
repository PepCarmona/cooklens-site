import { computed, readonly, ref, watch } from 'vue';

import { MealPlantEndpoint } from '@/api/endpoints/mealPlan';

import { getLastItem } from '@/helpers/array';

import dayjs from 'dayjs';
import {
	DayMeal,
	DayPlan,
	Meal,
	MealPlan,
	meals,
	CalendarBoundaries,
	Day,
	Week,
	Recipe,
} from 'cooklens-types';
import { WeekDay } from '@/shared/Calendar/CalendarTypes';

export default function useMealPlanState() {
	const mealPlanService = new MealPlantEndpoint();

	const selectedDay = ref<Day>(new WeekDay(new Date()));

	const mealPlan = ref<MealPlan>();
	const dayPlan = ref<DayPlan>(newDayPlan());

	const isLoading = ref(false);
	const isAddingMeal = ref(false);
	const isAddingRecipeToMeal = ref(false);
	const isAddingNewRecipeToMeal = ref(false);

	watch(selectedDay, () => (dayPlan.value = getDayPlan()), { immediate: true });
	watch(
		dayPlan,
		(newValue: DayPlan, oldValue: DayPlan) => {
			if (
				dayPlan.value.meals.length > 0 &&
				!mealPlan.value?.days.find((day) => day.date === dayPlan.value.date)
			) {
				mealPlan.value?.days.push(dayPlan.value);
			}

			if (oldValue.date === newValue.date) {
				updateMealPlan();
			}
		},
		{ deep: true }
	);

	const areAllMealsAdded = computed(() =>
		meals.every((meal) =>
			dayPlan.value.meals.some((dayMeal) => dayMeal.meal === meal)
		)
	);

	function getMealPlan(): Promise<MealPlan> {
		isLoading.value = true;

		return mealPlanService
			.getMealPlan()
			.then((serverMealPlan) => {
				mealPlan.value = serverMealPlan;

				if (dayPlan.value.meals.length === 0) {
					dayPlan.value = getDayPlan();
				}

				return serverMealPlan;
			})
			.finally(() => (isLoading.value = false));
	}

	function updateMealPlan(): void {
		if (!mealPlan.value) {
			return;
		}

		mealPlanService.updateMealPlan(mealPlan.value);
	}

	function getDayPlan(): DayPlan {
		if (!mealPlan.value) {
			return newDayPlan();
		}

		const index = mealPlan.value.days.findIndex(
			(day) => day.date === selectedDay.value.date
		);

		if (index < 0) {
			return newDayPlan();
		}

		return mealPlan.value.days[index];
	}

	function newDayPlan(): DayPlan {
		return {
			date: selectedDay.value.date,
			meals: [],
		};
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

	return {
		selectedDay: readonly(selectedDay),
		mealPlan: readonly(mealPlan),
		dayPlan: readonly(dayPlan),
		isAddingMeal: readonly(isAddingMeal),
		isAddingRecipeToMeal: readonly(isAddingRecipeToMeal),
		isAddingNewRecipeToMeal,
		areAllMealsAdded: readonly(areAllMealsAdded),

		getCalendarBoundaries,
		getMealPlan,
		addRecipeToMeal,
		removeMeal,
		selectDay: (day: Day) => (selectedDay.value = day),
		openMealSelector: () => (isAddingMeal.value = true),
		closeMealSelector: () => {
			isAddingMeal.value = false;
			isAddingRecipeToMeal.value = false;
			isAddingNewRecipeToMeal.value = false;
		},
		openRecipeSelector: () => (isAddingRecipeToMeal.value = true),
		closeRecipeSelector: () => (isAddingRecipeToMeal.value = false),
	};
}
