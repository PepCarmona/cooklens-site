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
        name: 'RecipeList',
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/RecipeList.vue'),
        props: (route) => ({
            searchBy: route.query.searchBy,
            searchText: route.query.searchText,
        }),
    },
    {
        path: '/about',
        name: 'About',
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/About.vue'),
    },
    {
        path: '/recipe/:title',
        name: 'Recipe',
        component: () =>
            import(
                /* webpackChunkName: "recipeDetails" */ '../views/Recipe.vue'
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
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
