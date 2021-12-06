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
                /* webpackChunkName: "about" */ '../views/RecipesMainView.vue'
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
                /* webpackChunkName: "recipeDetails" */ '../views/RecipeDetails.vue'
            ),
        props: (route) => ({ id: route.query.id, random: route.query.random }),
        meta: { invertedBG: true },
    },
    {
        path: '/recipe/form',
        name: 'CreateRecipe',
        component: () =>
            import(
                /* webpackChunkName: "createRecipe" */ '../components/recipes/CreateRecipe.vue'
            ),
    },
    {
        path: '/auth',
        name: 'Authentication',
        component: () =>
            import(
                /* webpackChunkName: "register" */ '../components/profile/auth/Authentication.vue'
            ),
        props: (route) => ({ nextUrl: route.query.nextUrl }),
        meta: { noFooter: true },
    },
    {
        path: '/profile',
        component: () =>
            import(
                /* webpackChunkName: "profileWrapper" */ '../components/profile/ProfileWrapper.vue'
            ),
        children: [
            {
                path: '',
                name: 'Profile',
                component: () =>
                    import(
                        /* webpackChunkName: "profile" */ '../components/profile/Profile.vue'
                    ),
                meta: { requireAuth: true },
            },
            {
                path: 'ownRecipes',
                name: 'ownRecipes',
                component: () =>
                    import(
                        /* webpackChunkName: "ownRecipes" */ '../components/profile/MyRecipes.vue'
                    ),
                meta: { requireAuth: true, showAddRecipe: true },
            },
            {
                path: 'favRecipes',
                name: 'favRecipes',
                component: () =>
                    import(
                        /* webpackChunkName: "favRecipes" */ '../components/profile/MyFavRecipes.vue'
                    ),
                meta: { requireAuth: true },
            },
            {
                path: 'myWeekPlan',
                name: 'myWeekPlan',
                component: () =>
                    import(
                        /* webpackChunkName: "favRecipes" */ '../components/profile/MyWeekPlan.vue'
                    ),
                meta: { requireAuth: true },
            },
            {
                path: 'myMealPlan',
                name: 'myMealPlan',
                component: () =>
                    import(
                        /* webpackChunkName: "favRecipes" */ '../components/profile/MyMealPlan.vue'
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
