<template>
    <div class="my-mealplan-container">
        <CustomModal
            :showIf="isShowingCalendar"
            :mode="'full'"
            @close="isShowingCalendar = false"
        >
            <Calendar
                :boundaries="calendarBoundaries"
                :selectedDay="selectedDay"
                @selected-day="
                    selectDay($event);
                    isShowingCalendar = false;
                "
                allowPast
            />
        </CustomModal>
        <CustomModal :showIf="isAddingMeal" @close="closeMealSelector()">
            <div v-if="isAddingRecipeToMeal" class="select-recipe">
                <RecipesMainComponent
                    @back="closeRecipeSelector()"
                    @see-more-info="showMoreInfo($event)"
                    @select-recipe="addRecipeToMeal(selectedMeal, $event)"
                    embedded
                    showActions
                />
            </div>
            <div v-else class="select-meal">
                <div class="select-meal-title">Add meal</div>
                <button
                    v-for="meal in meals"
                    :key="meal"
                    :disabled="
                        dayPlan.meals.some((dayMeal) => dayMeal.meal === meal)
                    "
                    @click="
                        selectedMeal = meal;
                        openRecipeSelector();
                    "
                >
                    <i
                        class="meal-icon las"
                        :class="{
                            'la-sun': meal === 'lunch',
                            'la-moon': meal === 'dinner',
                        }"
                    ></i>
                    <span>{{ capitalizeFirstLetter(meal) }}</span>
                    <i class="advance-icon las la-angle-right"></i>
                </button>
                <div class="cancel">
                    <button @click="closeMealSelector()">Cancel</button>
                </div>
            </div>
        </CustomModal>
        <CustomModal
            :showIf="!!recipeDetails"
            @close="recipeDetails = null"
            noPadding
        >
            <RecipeDetails
                :id="recipeDetails"
                @back="recipeDetails = null"
                embedded
            />
        </CustomModal>
        <PageHeader @go-back="back">
            <template v-slot:title>My Meal Plan</template>
        </PageHeader>
        <div class="mealplan-header">
            <div class="title">
                <span class="icon">
                    <i class="las la-map-pin" @click="showSelectedDay"></i>
                </span>
                <span class="month-text">{{ currentMonth }}</span>
                <span class="icon">
                    <i class="las la-calendar" @click="showCalendar"></i>
                </span>
            </div>
            <Swiper
                :modules="[Virtual]"
                :initialSlide="NUMBER_OF_PAST_WEEKS"
                :spaceBetween="30"
                @init="swiper = $event"
                @activeIndexChange="showingWeek = weeks[$event.activeIndex]"
                virtual
            >
                <SwiperSlide
                    v-for="(week, index) in weeks"
                    :key="index"
                    :virtualIndex="index"
                >
                    <div class="week">
                        <button
                            v-for="day in week"
                            :key="day"
                            class="day"
                            :class="{
                                selected: day.date === selectedDay.date,
                                past: day.isBeforeToday,
                            }"
                            @click="selectDay(day)"
                        >
                            <span class="day-name">
                                {{ day.dayNameShort.toUpperCase() }}
                            </span>
                            <span class="day-number">
                                {{ day.dayNumber }}
                            </span>
                        </button>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
        <div class="content">
            <div class="content-header">
                <span class="content-day">
                    {{ selectedDay.dayNameLong }} {{ selectedDay.dayNumber }}
                </span>
                <span
                    v-if="!selectedDay.isBeforeToday && !areAllMealsAdded"
                    class="add"
                    @click="openMealSelector()"
                >
                    <i class="las la-plus"></i>
                </span>
            </div>
            <div class="content-body">
                <div
                    v-for="meal in dayPlan.meals"
                    :key="meal.meal"
                    class="content-meal"
                    @click="recipeDetails = meal.recipe._id"
                >
                    <div class="content-meal-body">
                        <div class="content-meal-title">
                            {{ capitalizeFirstLetter(meal.meal) }}
                        </div>
                        <div class="content-meal-recipe">
                            {{ meal.recipe.title }}
                        </div>
                    </div>
                    <div class="content-meal-actions">
                        <i @click="removeMeal(meal)" class="las la-minus"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, Ref, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import PageHeader from '@/shared/PageHeader.vue';
import CustomModal from '@/shared/CustomModal.vue';
import Calendar from '@/shared/Calendar/Calendar.vue';
import RecipesMainComponent from '@/recipes/RecipesMainComponent.vue';
import RecipeDetails from '@/views/RecipeDetails.vue';

import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
import { Virtual } from 'swiper';
import 'swiper/swiper.min.css';
import { Swiper as ISwiper } from '@/helpers/swiper';

import { getLastItem } from '@/helpers/array';
import { weekdaysShort } from '@/helpers/date';
import { capitalizeFirstLetter } from '@/helpers/string';

import { Recipe } from '@/recipes/types/RecipeTypes';
import { Meal, meals } from '@/profile/components/MyMealPlan/MealPlanTypes';
import { CalendarBoundaries, Day, Week } from '@/shared/Calendar/CalendarTypes';

import { getWeek } from '@/shared/Calendar/CalendarModel';
import {
    getWeeks,
    NUMBER_OF_PAST_WEEKS,
} from '@/profile/components/MyMealPlan/MealPlanModel';

import useMealPlanState from './MealPlanState';

export default defineComponent({
    name: 'MyMealPlan',

    components: {
        PageHeader,
        CustomModal,
        Calendar,
        Swiper,
        SwiperSlide,
        RecipesMainComponent,
        RecipeDetails,
    },

    setup() {
        const router = useRouter();
        const mealPlanState = useMealPlanState();
        const { selectedDay, newDayPlan, getCalendarBoundaries } =
            mealPlanState;

        const weeks = ref<Week[]>(getWeeks()) as Ref<Week[]>;
        const showingWeek = ref<Week>(getWeek(new Date())) as Ref<Week>;

        const swiper = ref<ISwiper>();

        const calendarBoundaries = ref<CalendarBoundaries>({});
        const isShowingCalendar = ref(false);

        const selectedMeal = ref<Meal>();

        const recipeDetails = ref<string | null>(null);

        const currentMonth = computed(() => {
            const currentWeek = showingWeek.value.filter(
                (day) => day !== null
            ) as Day[];
            let text = currentWeek[0].month;

            if (currentWeek.some((day) => day.month !== text)) {
                text += ' / ' + getLastItem(currentWeek).month;
            }

            return text;
        });

        watch(
            () => showingWeek.value,
            () => {
                const index = weeks.value.indexOf(showingWeek.value);
                swiper.value?.slideTo(index);
            }
        );

        watch(
            () => selectedDay.value,
            () => {
                if (
                    !showingWeek.value.some(
                        (day) => day?.date === selectedDay.value.date
                    )
                ) {
                    const selectedWeek = weeks.value.find((week) =>
                        week.some((day) => day?.date === selectedDay.value.date)
                    );
                    if (selectedWeek) {
                        showingWeek.value = selectedWeek;
                    }
                }

                newDayPlan();
            }
        );

        function showSelectedDay() {
            const selectedWeekIndex = weeks.value.findIndex((week) =>
                week.some((day) => day?.date === selectedDay.value.date)
            );
            swiper.value?.slideTo(selectedWeekIndex);
        }

        async function showCalendar() {
            calendarBoundaries.value = getCalendarBoundaries(weeks.value);

            isShowingCalendar.value = true;

            await nextTick();

            document
                .querySelector('.calendar-month.selected')
                ?.scrollIntoView({ block: 'center' });
        }

        function showMoreInfo(recipe: Recipe) {
            recipeDetails.value = recipe._id!;
        }

        function back() {
            router.push({
                name: 'Profile',
            });
        }

        return {
            ...mealPlanState,
            NUMBER_OF_PAST_WEEKS,
            selectedDay,
            showingWeek,
            currentMonth,
            weeks,
            calendarBoundaries,
            isShowingCalendar,
            weekdaysShort,
            swiper,
            showSelectedDay,
            showCalendar,
            back,
            Virtual,
            meals,
            selectedMeal,
            capitalizeFirstLetter,
            showMoreInfo,
            recipeDetails,
        };
    },
});
</script>

<style scoped>
.my-mealplan-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
.mealplan-header {
    background-color: var(--background-color);
}
.mealplan-header > div {
    width: 100%;
}
.title {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}
.title > .icon {
    min-width: 25px;
    margin: 0 1rem;
}
.month-text {
    font-size: 20px;
    font-weight: 200;
    font-family: var(--title-font);
}
.week {
    display: flex;
    padding-bottom: 0.5rem;
}
.day {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}
.day > * {
    width: 100%;
    font-size: 14px;
}
.day-name {
    margin-bottom: 0.25rem;
}
.day-number {
    display: block;
    height: 25px;
    width: 25px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
.day.selected .day-number {
    background-color: var(--accent-color);
    border-radius: 25px;
    color: var(--inverted-text-color);
}
.day.past > * {
    color: var(--grey-600);
}
.content {
    flex-grow: 1;
}
.content-header {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0 1rem;
}
.content-day {
    font-size: 24px;
    font-weight: 600;
    word-spacing: 5px;
}

.select-meal {
    width: 100%;
}
.select-meal-title {
    font-size: 24px;
    margin-bottom: 1rem;
}
.select-meal > button {
    width: 100%;
    padding: 1rem;
    justify-content: flex-start;
    background-color: var(--background-color);
    border-radius: 0.5rem;
    position: relative;
}
.select-meal > button:not(:last-child) {
    margin-bottom: 1rem;
}
.select-meal > button > span {
    margin-left: 3rem;
    font-size: 18px;
}
.select-meal .meal-icon {
    position: absolute;
    left: 1rem;
}
.select-meal .advance-icon {
    position: absolute;
    right: 1rem;
}
.cancel {
    width: 100%;
    margin-top: 1.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-color);
}
.cancel > button {
    margin: auto;
    font-size: 20px;
    color: var(--accent-color);
}
.select-recipe {
    min-height: 625px;
}
.content-body {
    margin-top: 1rem;
}
.content-meal {
    padding: 1rem;
    border-bottom: 1px solid var(--shadow-color);
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.content-meal-title {
    color: var(--accent-color);
    margin-bottom: 0.4rem;
}
</style>
