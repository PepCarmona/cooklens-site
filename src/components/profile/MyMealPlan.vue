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
                    selectedDay = $event;
                    isShowingCalendar = false;
                "
            />
        </CustomModal>
        <CustomModal
            :showIf="isAddingMeal"
            @close="
                isAddingMeal = false;
                isAddingRecipeToMeal = false;
            "
        >
            <div v-if="isAddingRecipeToMeal" class="select-recipe">
                <!-- <div
                    class="back-to-select-meal"
                    @click="isAddingRecipeToMeal = false"
                >
                    <i class="las la-angle-left"></i>
                </div> -->
                <!-- Select recipe for meal {{ selectedMeal }} -->
                <RecipesMainComponent
                    @back="isAddingRecipeToMeal = false"
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
                        dayMeals.some((dayMeal) => dayMeal.meal === meal)
                    "
                    @click="
                        selectedMeal = meal;
                        isAddingRecipeToMeal = true;
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
                    <button
                        @click="
                            isAddingMeal = false;
                            isAddingRecipeToMeal = false;
                        "
                    >
                        Cancel
                    </button>
                </div>
            </div>
            <!-- select recipe after selecting meal OR add meal without recipe -->
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
                            :class="{ selected: day.date === selectedDay.date }"
                            @click="selectedDay = day"
                            :disabled="day.isBeforeToday"
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
                    v-if="!areAllMealsAdded"
                    class="add"
                    @click="isAddingMeal = true"
                >
                    <i class="las la-plus"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, Ref, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import PageHeader from '@/components/shared/PageHeader.vue';
import CustomModal from '@/components/shared/CustomModal.vue';
import Calendar, {
    CalendarBoundaries,
    WeekDay,
} from '@/components/shared/Calendar.vue';
import RecipesMainComponent from '@/components/recipes/RecipesMainComponent.vue';

import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
import { Virtual } from 'swiper';
import 'swiper/swiper.min.css';
import { Swiper as ISwiper } from '@/helpers/swiper';

import { getLastItem } from '@/helpers/array';
import { weekdaysShort } from '@/helpers/date';
import { capitalizeFirstLetter } from '@/helpers/string';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

import { Day, getWeek, Week } from '../shared/Calendar.vue';
import { Recipe } from '@/api/types/recipe';

const meals = ['lunch', 'dinner'] as const;
type Meal = typeof meals[number];

interface DayMeal {
    meal?: Meal;
    recipe?: Recipe;
}

export default defineComponent({
    name: 'MyMealPlan',

    components: {
        PageHeader,
        CustomModal,
        Calendar,
        Swiper,
        SwiperSlide,
        RecipesMainComponent,
    },

    setup() {
        const NUMBER_OF_FUTURE_WEEKS = 52;
        const NUMBER_OF_PAST_WEEKS = 52; // TODO: start on registration date

        const router = useRouter();

        const selectedDay = ref<Day>(new WeekDay(new Date()));
        const showingWeek = ref<Week>(getWeek(new Date())) as Ref<Week>;
        const weeks = ref<Week[]>([]) as Ref<Week[]>;

        for (
            let i = 0;
            i < NUMBER_OF_FUTURE_WEEKS + NUMBER_OF_PAST_WEEKS;
            i++
        ) {
            weeks.value.push(
                getWeek(
                    dayjs()
                        .add(i - NUMBER_OF_PAST_WEEKS, 'weeks')
                        .toDate()
                )
            );
        }

        const swiper = ref<ISwiper>();

        const calendarBoundaries = ref<CalendarBoundaries>({});
        const isShowingCalendar = ref(false);

        const isAddingMeal = ref(false);
        const isAddingRecipeToMeal = ref(false);
        const dayMeals = ref<DayMeal[]>([]);
        const selectedMeal = ref<Meal>();

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

        const areAllMealsAdded = computed(() =>
            meals.forEach((meal) =>
                dayMeals.value.some((dayMeal) => dayMeal.meal === meal)
            )
        );

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
            }
        );

        function showSelectedDay() {
            const selectedWeekIndex = weeks.value.findIndex((week) =>
                week.some((day) => day?.date === selectedDay.value.date)
            );
            swiper.value?.slideTo(selectedWeekIndex);
        }

        async function showCalendar() {
            const firstDay = weeks.value[0].filter(
                (day) => day !== null
            )[0] as Day;
            const lastDay = getLastItem(
                getLastItem(weeks.value).filter((day) => day !== null) as Day[]
            );

            calendarBoundaries.value.startDate = dayjs(firstDay.date).toDate();
            calendarBoundaries.value.endDate = dayjs(lastDay.date).toDate();

            isShowingCalendar.value = true;

            await nextTick();

            document
                .querySelector('.calendar-month.selected')
                ?.scrollIntoView({ block: 'center' });
        }

        function showMoreInfo(recipe: Recipe) {
            console.log(recipe);
        }

        function addRecipeToMeal(meal: Meal, recipe: Recipe) {
            console.log(meal, recipe);
        }

        function back() {
            router.push({
                name: 'Profile',
            });
        }

        return {
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
            dayMeals,
            isAddingMeal,
            areAllMealsAdded,
            selectedMeal,
            isAddingRecipeToMeal,
            capitalizeFirstLetter,
            showMoreInfo,
            addRecipeToMeal,
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
</style>
