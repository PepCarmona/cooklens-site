import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { showAddRecipe: true },
    },
    {
        path: '/recipes',
        name: 'RecipesMainView',
        component: () =>
            import(
                /* webpackChunkName: "about" */ '../recipes/RecipesMainView.vue'
            ),
        meta: { invertedBG: true, showAddRecipe: true },
    },
    {
        path: '/about',
        name: 'About',
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/About.vue'),
    },
    {
        path: '/recipe/:title',
        name: 'RecipeDetails',
        component: () =>
            import(
                /* webpackChunkName: "recipeDetails" */ '../recipes/RecipeDetails.vue'
            ),
        props: (route) => ({ id: route.query.id, random: route.query.random }),
        meta: { invertedBG: true },
    },
    {
        path: '/recipe/form',
        name: 'CreateRecipe',
        component: () =>
            import(
                /* webpackChunkName: "createRecipe" */ '../recipes/CreateRecipe.vue'
            ),
    },
    {
        path: '/auth',
        name: 'Authentication',
        component: () =>
            import(
                /* webpackChunkName: "register" */ '../auth/Authentication.vue'
            ),
        props: (route) => ({ nextUrl: route.query.nextUrl }),
        meta: { noFooter: true },
    },
    {
        path: '/profile',
        component: () =>
            import(
                /* webpackChunkName: "profileWrapper" */ '../profile/components/ProfileWrapper.vue'
            ),
        children: [
            {
                path: '',
                name: 'Profile',
                component: () =>
                    import(
                        /* webpackChunkName: "profile" */ '../profile/components/Profile.vue'
                    ),
                meta: { requireAuth: true },
            },
            {
                path: 'ownRecipes',
                name: 'ownRecipes',
                component: () =>
                    import(
                        /* webpackChunkName: "ownRecipes" */ '../profile/components/MyRecipes.vue'
                    ),
                meta: { requireAuth: true, showAddRecipe: true },
            },
            {
                path: 'favRecipes',
                name: 'favRecipes',
                component: () =>
                    import(
                        /* webpackChunkName: "favRecipes" */ '../profile/components/MyFavRecipes.vue'
                    ),
                meta: { requireAuth: true },
            },
            {
                path: 'myWeekPlan',
                name: 'myWeekPlan',
                component: () =>
                    import(
                        /* webpackChunkName: "favRecipes" */ '../profile/components/MyWeekPlan/MyWeekPlan.vue'
                    ),
                meta: { requireAuth: true },
            },
            {
                path: 'myMealPlan',
                name: 'myMealPlan',
                component: () =>
                    import(
                        /* webpackChunkName: "favRecipes" */ '../profile/components/MyMealPlan/MyMealPlan.vue'
                    ),
                meta: { requireAuth: true },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
