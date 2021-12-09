<template>
    <div class="my-mealplan-container">
        <CustomModal
            :showIf="calendar && calendar.length > 0"
            :mode="'full'"
            @close="calendar = undefined"
        >
            <div
                v-for="month in calendar"
                :key="month"
                class="calendar-month"
                :class="{ selected: month.isInView }"
            >
                <div class="calendar-month-title">
                    <span class="month-name">{{ month.monthName }}</span>
                    <span class="year">{{ month.year }}</span>
                </div>
                <div class="calendar-weekdays">
                    <div v-for="day in weekdaysShort" :key="day">
                        {{ day }}
                    </div>
                </div>
                <div class="calendar-month-body">
                    <div
                        v-for="week in month.weeks"
                        :key="week"
                        class="calendar-week"
                    >
                        <div
                            v-for="day in week"
                            :key="day"
                            class="calendar-day"
                        >
                            <button
                                v-if="day"
                                :class="{ selected: day.date === selectedDay }"
                                :disabled="day.isBeforeToday"
                                @click="
                                    selectedDay = day.date;
                                    calendar = [];
                                "
                            >
                                {{ day.dayNumber }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </CustomModal>
        <PageHeader @go-back="back">
            <template v-slot:title>My Meal Plan</template>
        </PageHeader>
        <div class="mealplan-header">
            <div class="title">
                <span class="icon">
                    <i
                        v-if="
                            swiper &&
                            swiper.activeIndex !== NUMBER_OF_PAST_WEEKS
                        "
                        class="las la-map-pin"
                        @click="showToday"
                    ></i>
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
                            :class="{ selected: day.date === selectedDay }"
                            @click="selectedDay = day.date"
                            :disabled="day.isBeforeToday"
                        >
                            <span class="day-name">
                                {{ day.dayName.toUpperCase() }}
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
            <div>Selected day: {{ selectedDay }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import PageHeader from '@/components/shared/PageHeader.vue';
import CustomModal from '@/components/shared/CustomModal.vue';
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
import { Virtual } from 'swiper';

import { Swiper as ISwiper } from '@/helpers/swiper';
import { getLastItem } from '@/helpers/array';
import { weekdaysShort } from '@/helpers/date';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);
import 'swiper/swiper.min.css';

type Calendar = CalendarMonth[];

type Week = [
    Day | null,
    Day | null,
    Day | null,
    Day | null,
    Day | null,
    Day | null,
    Day | null
];

interface CalendarMonth {
    monthNumber: number;
    monthName: string;
    year: number;
    weeks: Week[];
    isInView: boolean;
}

interface Day {
    month: string;
    dayNumber: string;
    dayName: string;
    weekday: number;
    date: string;
    isBeforeToday: boolean;
}

class WeekDay implements Day {
    month: string;
    dayNumber: string;
    dayName: string;
    weekday: number;
    isBeforeToday: boolean;
    date: string;
    unformattedDate: Date;

    constructor(_day: Date) {
        const day = dayjs(_day);

        this.month = day.format('MMMM');
        this.dayNumber = day.format('D');
        this.dayName = weekdaysShort[day.isoWeekday() - 1];
        this.date = day.format('M-DD-YYYY');
        this.isBeforeToday = day
            .startOf('day')
            .isBefore(dayjs().startOf('day'));
        this.weekday = day.isoWeekday();
        this.unformattedDate = day.toDate();
    }
}

export default defineComponent({
    name: 'MyMealPlan',

    components: {
        PageHeader,
        CustomModal,
        Swiper,
        SwiperSlide,
    },

    setup() {
        const NUMBER_OF_FUTURE_WEEKS = 52;
        const NUMBER_OF_PAST_WEEKS = 52; // TODO: start on registration date

        const router = useRouter();

        const selectedDay = ref(dayjs().format('M-DD-YYYY'));

        const showingWeek = ref<Day[]>(getWeek(new Date()));

        const weeks = ref<Day[][]>([]);
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

        const calendar = ref<Calendar>([]);

        const currentMonth = computed(() => {
            let text = showingWeek.value[0].month;

            if (showingWeek.value.some((day) => day.month !== text)) {
                text += ' / ' + showingWeek.value[6].month;
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
                        (day) => day.date === selectedDay.value
                    )
                ) {
                    const selectedWeek = weeks.value.find((week) =>
                        week.some((day) => day.date === selectedDay.value)
                    );
                    if (selectedWeek) {
                        showingWeek.value = selectedWeek;
                    }
                }
            }
        );

        function showToday() {
            swiper.value?.slideTo(NUMBER_OF_PAST_WEEKS);
        }

        async function showCalendar() {
            const startDate = dayjs(weeks.value[0][0].date).toDate();
            const endDate = dayjs(
                getLastItem(getLastItem(weeks.value)).date
            ).toDate();

            calendar.value = getCalendar(startDate, endDate);

            await nextTick();

            document
                .querySelector('.calendar-month.selected')
                ?.scrollIntoView({ block: 'center' });
        }

        function getWeek(day: Date) {
            const week: Day[] = [];
            const weekStart = dayjs(day).startOf('isoWeek');

            for (let i = 0; i < 7; i++) {
                const day = dayjs(weekStart).add(i, 'days');
                week.push(new WeekDay(day.toDate()));
            }

            return week;
        }

        function getEmptyWeek(): Week {
            return [null, null, null, null, null, null, null];
        }

        function getCalendar(start?: Date, end?: Date, period?: number) {
            const startDate = start ?? Date.now();
            const endDate =
                end ??
                dayjs(startDate)
                    .add(period ?? 730, 'days')
                    .toDate();

            const monthsDifference =
                dayjs(endDate).diff(dayjs(startDate), 'months') + 1;

            let calendar: Calendar = [];

            for (let i = 0; i <= monthsDifference; i++) {
                const date = dayjs(startDate).add(i, 'months');
                const month = date.month();
                const year = date.year();
                const daysInMonth = dayjs().month(month).daysInMonth();

                const weeks: Week[] = [];
                let week: Week = getEmptyWeek();

                let isInView = false;

                for (let j = 1; j <= daysInMonth; j++) {
                    const day = date.date(j);
                    if (
                        day.isBefore(dayjs(startDate)) ||
                        day.isAfter(dayjs(endDate))
                    ) {
                        continue;
                    }

                    if (day.isSame(dayjs(selectedDay.value))) {
                        isInView = true;
                    }

                    const weekday = day.isoWeekday() - 1;
                    week[weekday] = new WeekDay(day.toDate());

                    if (weekday === 6 || j === daysInMonth) {
                        weeks.push(week);
                        week = getEmptyWeek();
                    }
                }

                calendar.push({
                    monthNumber: month,
                    monthName: date.format('MMMM'),
                    year,
                    weeks,
                    isInView,
                });
            }

            return calendar;
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
            weekdaysShort,
            calendar,
            swiper,
            showToday,
            showCalendar,
            back,
            Virtual,
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

.calendar-month {
    width: 100%;
}
.calendar-month:not(:first-child) {
    margin-top: 2rem;
}
.calendar-month-title {
    background-color: var(--accent-color-complementary);
    color: white;
    padding: 0.25rem;
    border-radius: 0.5rem;
}
.month-name {
    font-size: 18px;
    font-family: var(--title-font);
}
.year {
    display: block;
    font-size: 14px;
    font-family: var(--title-font);
}
.calendar-weekdays {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    color: var(--grey-600);
}
.calendar-weekdays > * {
    width: calc(100% / 7);
}
.calendar-week {
    display: flex;
    padding: 0.25rem 0;
}
.calendar-day {
    width: calc(100% / 7);
}
.calendar-day > * {
    display: block;
    height: 25px;
    width: 25px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
.calendar-day > *.selected {
    background-color: var(--accent-color);
    border-radius: 25px;
    color: var(--inverted-text-color);
}
</style>
