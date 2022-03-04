import { MealPlantEndpoint } from '@/api/endpoints/mealPlan';
import { loadingState } from '@/LoadingState';
import { DayPlan, MealPlan } from 'cooklens-types';
import { watch } from 'vue';
import { MealPlanState } from './MealPlanState';

const mealPlanEndpoint = new MealPlantEndpoint();

export default function createMealPlanService(mealPlanState: MealPlanState) {
	const { isLoadingMealPlan } = loadingState;

	watch(
		mealPlanState.dayPlan,
		(newValue: DayPlan, oldValue: DayPlan) => {
			if (
				mealPlanState.dayPlan.value.meals.length > 0 &&
				!mealPlanState.mealPlan.value?.days.find(
					(day) => day.date === mealPlanState.dayPlan.value.date
				)
			) {
				mealPlanState.mealPlan.value?.days.push(mealPlanState.dayPlan.value);
			}

			if (oldValue.date === newValue.date) {
				updateMealPlan();
			}
		},
		{ deep: true }
	);

	function getMealPlan(): Promise<MealPlan> {
		isLoadingMealPlan.value = true;

		return mealPlanEndpoint
			.getMealPlan()
			.then((serverMealPlan) => {
				mealPlanState.mealPlan.value = serverMealPlan;

				if (mealPlanState.dayPlan.value.meals.length === 0) {
					mealPlanState.dayPlan.value = mealPlanState.getDayPlan();
				}

				return serverMealPlan;
			})
			.finally(() => (isLoadingMealPlan.value = false));
	}

	function updateMealPlan(): void {
		if (!mealPlanState.mealPlan.value) {
			return;
		}

		mealPlanEndpoint.updateMealPlan(mealPlanState.mealPlan.value);
	}

	return {
		getMealPlan,
	};
}

export type MealPlanService = ReturnType<typeof createMealPlanService>;
