import { UserEndpoint } from '@/api/endpoints/user';
import { WeekPlanEndpoint } from '@/api/endpoints/weekPlan';
import { Recipe } from '@/api/types/recipe';
import { DailyPlan, WeekPlan } from '@/api/types/weekPlan';
import moment from 'moment';
import { computed, Ref, ref } from 'vue';
import useAuthState from './auth-state';
moment.updateLocale('en', {
    week: {
        dow: 1,
    },
});

export const weekDays = moment.weekdaysShort();
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

const user = useAuthState().authenticatedUser;

function defaultWeekPlan(): WeekPlan {
    return {
        name: 'New Week Plan',
        dailyPlans: [{}, {}, {}, {}, {}, {}, {}],
        author: user.value?._id ?? '',
    };
}

const isNewWeekPlan = ref(true);

const selectedWeekPlan = ref(defaultWeekPlan()) as Ref<WeekPlan>;
const myWeekPlans = ref<WeekPlan[]>([]);

function getMyWeekPlans() {
    isLoading.value = true;

    return userService
        .getMyWeekPlans()
        .then((weekPlans) => {
            myWeekPlans.value = weekPlans;
        })
        .finally(() => (isLoading.value = false));
}

function getWeekPlan(id: string) {
    isLoading.value = true;

    return weekPlanService
        .getWeekPlanById(id)
        .finally(() => (isLoading.value = false));
}

function selectWeekPlan(id: string | null) {
    if (!id) {
        selectedWeekPlan.value = defaultWeekPlan();
        isNewWeekPlan.value = true;
        return;
    }
    getWeekPlan(id).then((weekPlan) => {
        selectedWeekPlan.value = weekPlan;
        isNewWeekPlan.value = true;
    });
}

function addRecipeToWeekPlan(
    recipe: Recipe,
    day: number,
    meal: keyof DailyPlan
) {
    if (day < 0 || day > 6) {
        console.error('Not valid day');
        return;
    }
    selectedWeekPlan.value.dailyPlans[day][meal] = recipe;
}

export default function useWeekPlanState() {
    return {
        isLoading: computed(() => isLoading.value),
        selectedWeekPlan: computed(() => selectedWeekPlan.value),
        myWeekPlans: computed(() => myWeekPlans.value),

        getMyWeekPlans,
        getWeekPlan,
        selectWeekPlan,
        addRecipeToWeekPlan,
    };
}
