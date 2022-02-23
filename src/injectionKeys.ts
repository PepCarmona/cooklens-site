import { InjectionKey } from 'vue';
import { AuthenticationState } from './auth/state/AuthenticationState';
import { MealPlanState } from './profile/components/MyMealPlan/MealPlanState';
import { UserState } from './profile/state/UserState';
import { RecipeState } from './recipes/state/RecipeState';
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
