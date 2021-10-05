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
                /* webpackChunkName: "createRecipe" */ '../components/CreateRecipe.vue'
            ),
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import(/* webpackChunkName: "login" */ '../components/Login.vue'),
    },
    {
        path: '/register',
        name: 'Register',
        component: () =>
            import(
                /* webpackChunkName: "register" */ '../components/Register.vue'
            ),
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () =>
            import(
                /* webpackChunkName: "profile" */ '../components/Profile.vue'
            ),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
