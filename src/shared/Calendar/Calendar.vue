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
				<div v-for="week in month.weeks" :key="week" class="calendar-week">
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

import { getCalendar } from '@/shared/Calendar/CalendarModel';

import { CalendarBoundaries, Day, Calendar } from 'cooklens-types';

export default defineComponent({
	name: 'Calendar',

	props: {
		boundaries: Object as PropType<CalendarBoundaries>,
		selectedDay: Object as PropType<Day>,
		allowPast: Boolean,
	},

	emits: ['selected-day'],

	setup(props) {
		const calendar = ref<Calendar>(
			getCalendar(props.boundaries, props.selectedDay)
		);

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
