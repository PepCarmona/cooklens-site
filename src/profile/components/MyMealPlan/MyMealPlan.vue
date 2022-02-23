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
				<CreateRecipe
					v-if="isAddingNewRecipeToMeal"
					@go-back="isAddingNewRecipeToMeal = false"
					@newRecipeSaved="addRecipeToMeal(selectedMeal, $event)"
					embedded
				/>
				<RecipesListAndSearch
					v-else
					@back="closeRecipeSelector()"
					@see-more-info="showMoreInfo($event)"
					@select-recipe="addRecipeToMeal(selectedMeal, $event)"
					@create-recipe="isAddingNewRecipeToMeal = true"
					embedded
					showActions
					showCreateRecipe
				/>
			</div>
			<div v-else class="select-meal">
				<div class="select-meal-title">Add meal</div>
				<Button
					v-for="meal in meals"
					:key="meal"
					class="select-meal-button"
					:disabled="dayPlan.meals.some((dayMeal) => dayMeal.meal === meal)"
					@click="
						selectedMeal = meal;
						openRecipeSelector();
					"
				>
					<i
						class="meal-icon las"
						:class="{
							'la-coffee': meal === 'breakfast',
							'la-sun': meal === 'lunch',
							'la-cookie-bite': meal === 'snack',
							'la-moon': meal === 'dinner',
						}"
					></i>
					<span>{{ capitalizeFirstLetter(meal) }}</span>
					<i class="advance-icon las la-angle-right"></i>
				</Button>
				<Button class="closeModal" @click="closeMealSelector()">Cancel</Button>
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
				<Button class="icon">
					<i class="las la-map-pin" @click="showSelectedDay"></i>
				</Button>
				<span class="month-text">{{ currentMonth }}</span>
				<Button class="icon">
					<i class="las la-calendar" @click="showCalendar"></i>
				</Button>
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
						<Button
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
						</Button>
					</div>
				</SwiperSlide>
			</Swiper>
		</div>
		<div class="content">
			<div class="content-header">
				<span class="content-day">
					{{ selectedDay.dayNameLong }} {{ selectedDay.dayNumber }}
				</span>
				<Button
					v-if="!selectedDay.isBeforeToday && !areAllMealsAdded"
					class="add"
					@click="openMealSelector()"
				>
					<i class="las la-plus"></i>
				</Button>
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
					<div v-if="!selectedDay.isBeforeToday" class="content-meal-actions">
						<Button class="remove" @click="removeMeal(meal)">
							<i class="las la-minus"></i>
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {
	computed,
	defineAsyncComponent,
	defineComponent,
	nextTick,
	Ref,
	ref,
	watch,
} from 'vue';
import { useRouter } from 'vue-router';

import PageHeader from '@/shared/PageHeader.vue';
import CustomModal from '@/shared/CustomModal.vue';

import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
import { Virtual } from 'swiper';
import 'swiper/swiper.min.css';
import { Swiper as ISwiper } from '@/helpers/swiper';

import { getLastItem } from '@/helpers/array';
import { weekdaysShort } from '@/helpers/date';
import { capitalizeFirstLetter } from '@/helpers/string';

import {
	Recipe,
	Meal,
	meals,
	CalendarBoundaries,
	Day,
	Week,
} from 'cooklens-types';

import { getWeek } from '@/shared/Calendar/CalendarModel';
import {
	getWeeks,
	NUMBER_OF_PAST_WEEKS,
} from '@/profile/components/MyMealPlan/MealPlanModel';

import createMealPlanState from './MealPlanState';

export default defineComponent({
	name: 'MyMealPlan',

	components: {
		PageHeader,
		CustomModal,
		Swiper,
		SwiperSlide,
		Calendar: defineAsyncComponent(
			() => import('@/shared/Calendar/Calendar.vue')
		),
		RecipesListAndSearch: defineAsyncComponent(
			() => import('@/recipes/RecipesListAndSearch.vue')
		),
		RecipeDetails: defineAsyncComponent(
			() => import('@/recipes/RecipeDetails.vue')
		),
		CreateRecipe: defineAsyncComponent(
			() => import('@/recipes/CreateRecipe.vue')
		),
	},

	setup() {
		const router = useRouter();
		const mealPlanState = createMealPlanState();
		const { selectedDay, getCalendarBoundaries, getMealPlan } = mealPlanState;

		getMealPlan();

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
					!showingWeek.value.some((day) => day?.date === selectedDay.value.date)
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

<style lang="scss" scoped>
@import './MealPlan.scss';
</style>
