import { computed, Ref, ref, watch } from 'vue';

import { UserEndpoint } from '@/api/endpoints/user';
import { WeekPlanEndpoint } from '@/api/endpoints/weekPlan';

import { Recipe } from '@/recipes/types/RecipeTypes';
import {
	DailyPlan,
	WeekPlan,
} from '@/profile/components/MyWeekPlan/WeekPlanTypes';

import useAuthenticationState from '@/auth/state/AuthenticationState';

export const fakeWeekPlans: WeekPlan[] = [
	{
		name: 'Fake Week Plan1',
		dailyPlans: [
			{
				lunch: 'Lunch 1-1',
			},
			{
				lunch: 'Lunch 1-2',
				dinner: 'dinner 1-2',
			},
			{
				lunch: 'Lunch 1-3',
			},
			{
				dinner: 'dinner 1-4',
			},
			{
				lunch: 'Lunch 1-5',
				dinner: 'dinner 1-5',
			},
			{},
			{},
		],
		author: 'Pep',
	},
	{
		name: 'Fake Week Plan2',
		dailyPlans: [
			{},
			{
				dinner: 'dinner 2-2',
			},
			{
				dinner: 'dinner 2-3',
			},
			{
				dinner: 'dinner 2-4',
			},
			{
				lunch: 'lunch 2-5',
				dinner: 'dinner 2-5',
			},
			{},
			{},
		],
		author: 'Pep',
	},
	{
		name: 'Fake Week Plan3',
		dailyPlans: [
			{
				lunch: 'Lunch 3-1',
				dinner: 'dinner 3-1',
			},
			{
				lunch: 'Lunch 3-2',
			},
			{
				lunch: 'Lunch 3-3',
			},
			{
				lunch: 'lunch 3-4',
				dinner: 'dinner 3-4',
			},
			{},
			{},
			{},
		],
		author: 'Pep',
	},
];
export const newWeekPlan: WeekPlan = {
	name: 'New Week Plan',
	dailyPlans: [{}, {}, {}, {}, {}, {}, {}],
	author: 'Pep',
};

const userService = new UserEndpoint();
const weekPlanService = new WeekPlanEndpoint();

const isLoading = ref(false);
const isNewWeekPlan = ref(true);
const isNewSelectedWeekPlan = ref(false);
const hasSelectedWeekPlanChanged = ref(false);

const user = useAuthenticationState().authenticatedUser;

function defaultWeekPlan(): WeekPlan {
	return {
		name: '',
		dailyPlans: [{}, {}, {}, {}, {}, {}, {}],
		author: user.value?._id ?? '',
	};
}

const selectedWeekPlan = ref(defaultWeekPlan()) as Ref<WeekPlan>;
const myWeekPlans = ref<WeekPlan[]>([]);

const isNameValid = computed<boolean>(
	() =>
		!myWeekPlans.value.some(
			(weekPlan) =>
				weekPlan._id !== selectedWeekPlan.value._id &&
				weekPlan.name === selectedWeekPlan.value.name.replace(/\s*$/, '')
		) &&
		selectedWeekPlan.value.name.replace(/\s*$/, '') !== 'New Week Plan' &&
		selectedWeekPlan.value.name.length > 0
);

function getMyWeekPlans(): Promise<WeekPlan[]> {
	isLoading.value = true;

	return userService
		.getMyWeekPlans()
		.then((weekPlans) => {
			myWeekPlans.value = weekPlans;

			return weekPlans;
		})
		.finally(() => (isLoading.value = false));
}

function getWeekPlan(id: string) {
	isLoading.value = true;

	return weekPlanService
		.getWeekPlanById(id)
		.finally(() => (isLoading.value = false));
}

function selectWeekPlan(weekPlan: WeekPlan | string | undefined) {
	let matched = true;

	switch (typeof weekPlan) {
		case 'undefined':
			selectedWeekPlan.value = defaultWeekPlan();
			isNewWeekPlan.value = true;
			break;

		case 'object':
			Object.assign(selectedWeekPlan.value, weekPlan);
			isNewWeekPlan.value = false;
			break;

		case 'string':
			getWeekPlan(weekPlan).then(async (weekPlan) => {
				selectedWeekPlan.value = weekPlan;
				isNewWeekPlan.value = false;
			});
			break;

		default:
			matched = false;
	}

	if (matched) {
		hasSelectedWeekPlanChanged.value = false;

		isNewSelectedWeekPlan.value = true;

		setTimeout(() => (isNewSelectedWeekPlan.value = false), 300);
	}
}

function addRecipeToWeekPlan(
	recipe: Recipe,
	day: number,
	meal: keyof DailyPlan
) {
	selectedWeekPlan.value.dailyPlans[day][meal] = recipe;
	hasSelectedWeekPlanChanged.value = true;
}

function removeRecipeFromWeekPlan(day: number, meal: keyof DailyPlan) {
	selectedWeekPlan.value.dailyPlans[day][meal] = undefined;
	hasSelectedWeekPlanChanged.value = true;
}

function saveWeekPlan(weekPlan: WeekPlan): Promise<WeekPlan> {
	isLoading.value = true;

	weekPlan.author = user.value?._id;

	weekPlan.name = weekPlan.name.replace(/\s*$/, '');

	return isNewWeekPlan.value
		? weekPlanService
				.createWeekPlan(weekPlan)
				.then((savedWeekPlan) => {
					hasSelectedWeekPlanChanged.value = false;
					myWeekPlans.value.push(savedWeekPlan);
					selectWeekPlan(savedWeekPlan);
					isNewWeekPlan.value = false;
					return savedWeekPlan;
				})
				.finally(() => (isLoading.value = false))
		: weekPlanService
				.updateWeekPlan(weekPlan)
				.then((updatedWeekPlan) => {
					hasSelectedWeekPlanChanged.value = false;
					myWeekPlans.value.splice(
						myWeekPlans.value.findIndex(
							(myWeekPlan) => myWeekPlan._id === updatedWeekPlan._id
						),
						1,
						updatedWeekPlan
					);
					selectWeekPlan(updatedWeekPlan);
					return updatedWeekPlan;
				})
				.finally(() => (isLoading.value = false));
}

function deleteWeekPlan(weekPlan: WeekPlan): Promise<WeekPlan> | undefined {
	if (
		!confirm(
			'Are you sure you want to delete weekplan "' + weekPlan.name + '"?'
		)
	) {
		return;
	}

	isLoading.value = true;

	return weekPlanService
		.deleteWeekPlan(weekPlan)
		.then((deletedWeekPlan) => {
			selectWeekPlan(undefined);
			myWeekPlans.value.splice(
				myWeekPlans.value.findIndex(
					(myWeekPlan) => myWeekPlan._id === deletedWeekPlan._id
				),
				1
			);
			return deletedWeekPlan;
		})
		.finally(() => (isLoading.value = false));
}

watch(
	() => selectedWeekPlan.value.name,
	() => {
		if (!isNewSelectedWeekPlan.value) {
			hasSelectedWeekPlanChanged.value = true;
		}
	}
);

export default function useWeekPlanState() {
	return {
		isLoading: computed(() => isLoading.value),
		isNewWeekPlan: computed(() => isNewWeekPlan.value),
		hasSelectedWeekPlanChanged: computed(
			() => hasSelectedWeekPlanChanged.value
		),
		selectedWeekPlan: computed(() => selectedWeekPlan.value),
		myWeekPlans: computed(() => myWeekPlans.value),
		isNameValid,

		getMyWeekPlans,
		getWeekPlan,
		selectWeekPlan,
		addRecipeToWeekPlan,
		removeRecipeFromWeekPlan,
		saveWeekPlan,
		deleteWeekPlan,
	};
}
