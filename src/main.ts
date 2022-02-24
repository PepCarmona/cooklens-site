import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';

import Button from '@/shared/Button.vue';

import { setupFeatureToggle } from './helpers/featureToggle';

import createRecipeState from './recipes/RecipeState';
import createUserState from './profile/UserState';
import createPaginationState from './shared/Pagination/PaginationState';
import createAuthenticationState from '@/auth/AuthenticationState';
import createMealPlanState from './profile/components/MyMealPlan/MealPlanState';
import createNotificationState from './shared/Notifications/NotifiactionState';

import {
	AuthStateKey,
	MealPlanStateKey,
	NotificationStateKey,
	PaginationStatekey,
	RecipeStateKey,
	UserStateKey,
} from './injectionKeys';

export const authState = createAuthenticationState();
const paginationState = createPaginationState();
const recipeState = createRecipeState(authState, paginationState);
const userState = createUserState(authState, paginationState);
const mealPlanState = createMealPlanState();
const notificationState = createNotificationState();

setupFeatureToggle();

const app = createApp(App);
app.use(router);
app.use(VueAxios, axios);
app.provide('axios', app.config.globalProperties.axios);
app.provide(RecipeStateKey, recipeState);
app.provide(UserStateKey, userState);
app.provide(PaginationStatekey, paginationState);
app.provide(AuthStateKey, authState);
app.provide(MealPlanStateKey, mealPlanState);
app.provide(NotificationStateKey, notificationState);

app.component('Button', Button);

app.mount('#app');
