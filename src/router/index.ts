import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/recipes',
        name: 'RecipesMainView',
        component: () =>
            import(
                /* webpackChunkName: "about" */ '../views/RecipesMainView.vue'
            ),
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
    },
    {
        path: '/recipe/add',
        name: 'CreateRecipe',
        component: () =>
            import(
                /* webpackChunkName: "createRecipe" */ '../components/recipes/CreateRecipe.vue'
            ),
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import(
                /* webpackChunkName: "login" */ '../components/profile/auth/Login.vue'
            ),
    },
    {
        path: '/register',
        name: 'Register',
        component: () =>
            import(
                /* webpackChunkName: "register" */ '../components/profile/auth/Register.vue'
            ),
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
            },
            {
                path: 'myRecipes',
                name: 'myRecipes',
                component: () =>
                    import(
                        /* webpackChunkName: "myRecipes" */ '../components/profile/MyRecipes.vue'
                    ),
            },
            {
                path: 'favRecipes',
                name: 'favRecipes',
                component: () =>
                    import(
                        /* webpackChunkName: "favRecipes" */ '../components/profile/MyFavRecipes.vue'
                    ),
            },
            {
                path: 'myWeekPlan',
                name: 'myWeekPlan',
                component: () =>
                    import(
                        /* webpackChunkName: "favRecipes" */ '../components/profile/MyWeekPlan.vue'
                    ),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
