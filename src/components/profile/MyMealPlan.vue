<template>
    <div class="my-mealplan-container">
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
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import PageHeader from '@/components/shared/PageHeader.vue';
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
import { Virtual } from 'swiper';
import { Swiper as ISwiper } from '@/helpers/swiper';

import moment from 'moment';
import 'swiper/swiper.min.css';

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
        Swiper,
        SwiperSlide,
    },

    setup() {
        const NUMBER_OF_FUTURE_WEEKS = 52;
        const NUMBER_OF_PAST_WEEKS = 52; // TODO: start on registration date

        const router = useRouter();

        const selectedDay = ref(moment().format('DD/M/YYYY'));

        const showingWeek = ref<Day[]>(getWeek(new Date()));

        const weeks = ref<Day[][]>([]);
        for (
            let i = 0;
            i < NUMBER_OF_FUTURE_WEEKS + NUMBER_OF_PAST_WEEKS;
            i++
        ) {
            weeks.value.push(
                getWeek(
                    moment()
                        .add(i - NUMBER_OF_PAST_WEEKS, 'weeks')
                        .toDate()
                )
            );
        }

        const swiper = ref<ISwiper>();

        const currentMonth = computed(() => {
            let text = showingWeek.value[0].month;

            if (showingWeek.value.some((day) => day.month !== text)) {
                text += ' / ' + showingWeek.value[6].month;
            }

            return text;
        });

        function showToday() {
            swiper.value?.slideTo(NUMBER_OF_PAST_WEEKS);
        }

        function showCalendar() {
            console.log('calendar');
        }

        function getWeek(day: Date) {
            const week: Day[] = [];
            const weekStart = moment(day).startOf('isoWeek');

            for (let i = 0; i < 7; i++) {
                const day = moment(weekStart).add(i, 'days');
                week.push(new WeekDay(day.toDate()));
            }

            return week;
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
</style>
