import { InjectionKey } from 'vue';
import { AuthService } from './auth/AuthenticationService';
import { AuthenticationState } from './auth/AuthenticationState';
import { LoadingState } from './LoadingState';
import { MealPlanState } from './profile/components/MyMealPlan/MealPlanState';
import { UserState } from './profile/UserState';
import { RecipeService } from './recipes/RecipeService';
import { RecipeState } from './recipes/RecipeState';
import { NotificationState } from './shared/Notifications/NotifiactionState';
import { PaginationState } from './shared/Pagination/PaginationState';

export const RecipeStateKey: InjectionKey<RecipeState> = Symbol('recipeState');
export const UserStateKey: InjectionKey<UserState> = Symbol('userState');
export const PaginationStatekey: InjectionKey<PaginationState> =
	Symbol('paginationState');
export const AuthStateKey: InjectionKey<AuthenticationState> =
	Symbol('authState');
export const MealPlanStateKey: InjectionKey<MealPlanState> =
	Symbol('mealPlanState');
export const NotificationStateKey: InjectionKey<NotificationState> =
	Symbol('notificationState');
export const LoadingStateKey: InjectionKey<LoadingState> =
	Symbol('loadingState');

export const RecipeServiceKey: InjectionKey<RecipeService> =
	Symbol('recipeService');
export const AuthServiceKey: InjectionKey<AuthService> = Symbol('authService');
