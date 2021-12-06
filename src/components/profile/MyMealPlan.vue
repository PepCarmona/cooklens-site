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
                <div
                    v-for="day in currentWeek"
                    :key="day"
                    class="day"
                    :class="{ selected: day.isToday }"
                >
                    <span class="day-name">
                        {{ day.dayName.toUpperCase() }}
                    </span>
                    <span class="day-number">
                        {{ day.dayNumber }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import PageHeader from '@/components/shared/PageHeader.vue';
import { useRouter } from 'vue-router';
import moment from 'moment';

export default defineComponent({
    name: 'MyMealPlan',

    components: {
        PageHeader,
    },

    setup() {
        const router = useRouter();

        const currentWeek = computed(() => {
            const week = [];

            const weekStart = moment().startOf('isoWeek');

            for (let i = 0; i < 7; i++) {
                const day = moment(weekStart).add(i, 'days');
                week.push({
                    month: day.format('MMMM'),
                    dayNumber: day.date(),
                    dayName: day.format('ddd'),
                    isToday: moment().startOf('day').isSame(day.startOf('day')),
                });
            }

            return week;
        });

        const currentMonth = computed(() => {
            let text = currentWeek.value[0].month;

            if (currentWeek.value.some((day) => day.month !== text)) {
                text += ' / ' + currentWeek.value[6].month;
            }

            return text;
        });

        function back() {
            router.push({
                name: 'Profile',
            });
        }
        return {
            currentWeek,
            currentMonth,
            back,
        };
    },
});
</script>

<style scoped>
.my-mealplan-container {
    background-color: var(--background-color);
}
.mealplan-header {
    display: flex;
    flex-wrap: wrap;
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
</style>
