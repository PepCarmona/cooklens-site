<template>
    <div class="my-mealplan-container">
        <PageHeader @go-back="back">
            <template v-slot:title>My Meal Plan</template>
        </PageHeader>
        <div class="mealplan-header">
            <div class="month-text">
                {{ currentMonth }}
            </div>
            <div class="week">
                <button
                    v-for="day in currentWeek"
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
        </div>

        <div class="content">
            <div>Selected day: {{ selectedDay }}</div>
            <div>
                <button
                    @click="showPreviousWeek()"
                    :disabled="currentWeekIndex === 0"
                >
                    Prev
                </button>
                <button
                    @click="showNextWeek()"
                    :disabled="currentWeekIndex === weeks.length - 1"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import PageHeader from '@/components/shared/PageHeader.vue';
import { useRouter } from 'vue-router';
import moment from 'moment';

interface Day {
    month: string;
    dayNumber: number;
    dayName: string;
    date: string;
    isBeforeToday: boolean;
}

class WeekDay implements Day {
    month: string;
    dayNumber: number;
    dayName: string;
    isBeforeToday: boolean;
    date: string;

    constructor(_day: Date) {
        const day = moment(_day);

        this.month = day.format('MMMM');
        this.dayNumber = day.date();
        this.dayName = day.format('ddd');
        this.date = day.format('DD/M/YYYY');
        this.isBeforeToday = day
            .startOf('day')
            .isBefore(moment().startOf('day'));
    }
}

export default defineComponent({
    name: 'MyMealPlan',

    components: {
        PageHeader,
    },

    setup() {
        const router = useRouter();

        const selectedDay = ref(moment().format('DD/M/YYYY'));

        const currentWeek = ref<Day[]>(getWeek(new Date()));

        const currentWeekIndex = computed(() =>
            weeks.findIndex(
                (week) => week[0].date === currentWeek.value[0].date
            )
        );

        const weeks: Day[][] = [];

        for (let i = 0; i < 14; i++) {
            weeks.push(
                getWeek(
                    moment()
                        .add(i - 4, 'weeks')
                        .toDate()
                )
            );
        }

        const currentMonth = computed(() => {
            let text = currentWeek.value[0].month;

            if (currentWeek.value.some((day) => day.month !== text)) {
                text += ' / ' + currentWeek.value[6].month;
            }

            return text;
        });

        function getWeek(day: Date) {
            const week: Day[] = [];
            const weekStart = moment(day).startOf('isoWeek');

            for (let i = 0; i < 7; i++) {
                const day = moment(weekStart).add(i, 'days');
                week.push(new WeekDay(day.toDate()));
            }

            return week;
        }

        function showPreviousWeek() {
            currentWeek.value = weeks[currentWeekIndex.value - 1];
        }

        function showNextWeek() {
            currentWeek.value = weeks[currentWeekIndex.value + 1];
        }

        function back() {
            router.push({
                name: 'Profile',
            });
        }
        return {
            selectedDay,
            currentWeek,
            currentWeekIndex,
            currentMonth,
            weeks,
            showPreviousWeek,
            showNextWeek,
            back,
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
.month-text {
    font-size: 20px;
    font-weight: 200;
    font-family: var(--title-font);
    margin-bottom: 1rem;
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
</style>
