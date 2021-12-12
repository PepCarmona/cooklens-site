<template>
    <div class="calendar">
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
                    <div v-for="day in week" :key="day" class="calendar-day">
                        <button
                            v-if="day"
                            :class="{
                                selected: day.date === selectedDay.date,
                                past: day.isBeforeToday,
                            }"
                            :disabled="!allowPast && day.isBeforeToday"
                            @click="$emit('selected-day', day)"
                        >
                            {{ day.dayNumber }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

import { weekdaysShort } from '@/helpers/date';

import {
    Calendar,
    CalendarBoundaries,
    Day,
    Week,
    WeekDay,
} from '@/shared/Calendar/CalendarTypes';

import { getEmptyWeek } from '@/shared/Calendar/CalendarModel';

export default defineComponent({
    name: 'Calendar',

    props: {
        boundaries: Object as PropType<CalendarBoundaries>,
        selectedDay: Object as PropType<Day>,
        allowPast: Boolean,
    },

    emits: ['selected-day'],

    setup(props) {
        const calendar = ref<Calendar>(getCalendar());

        function getCalendar() {
            const startDate = props.boundaries?.startDate ?? Date.now();
            const endDate =
                props.boundaries?.endDate ??
                dayjs(startDate)
                    .add(props.boundaries?.duration ?? 730, 'days')
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

                    if (day.isSame(dayjs(props.selectedDay?.date))) {
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
        return {
            calendar,
            weekdaysShort,
        };
    },
});
</script>

<style scoped>
.calendar {
    width: 100%;
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
    font-size: 14px;
}
.calendar-day > *.selected {
    background-color: var(--accent-color);
    border-radius: 25px;
    color: var(--inverted-text-color);
}
.calendar-day > *.past:not(.selected) {
    color: var(--grey-600);
}
</style>
