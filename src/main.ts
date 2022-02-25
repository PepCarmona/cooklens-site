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
import createMealPlanState from './profile/components/MyMealPlan/MealPlanState';
import createNotificationState from './shared/Notifications/NotifiactionState';

import {
	AuthServiceKey,
	AuthStateKey,
	LoadingStateKey,
	MealPlanStateKey,
	NotificationStateKey,
	PaginationStatekey,
	RecipeServiceKey,
	RecipeStateKey,
	UserStateKey,
} from './injectionKeys';
import createRecipeService from './recipes/RecipeService';
import createAuthenticationService from './auth/AuthenticationService';
import { loadingState } from './LoadingState';
import { authState } from './auth/AuthenticationState';

const paginationState = createPaginationState();
const recipeState = createRecipeState(authState);
const userState = createUserState(authState, paginationState);
const mealPlanState = createMealPlanState();
const notificationState = createNotificationState();

const recipeService = createRecipeService(
	recipeState,
	authState,
	paginationState
);
const authService = createAuthenticationService(authState);

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
app.provide(LoadingStateKey, loadingState);

app.provide(RecipeServiceKey, recipeService);
app.provide(AuthServiceKey, authService);

app.component('Button', Button);

app.mount('#app');
