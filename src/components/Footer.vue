<template>
    <footer>
        <div class="add-recipe">
            <i class="las la-plus mb-05 pt-05" style="color: white"></i>
        </div>
        <div id="mobile-sticky-footer">
            <div>
                <router-link to="/">
                    <i
                        class="las la-home"
                        :class="{ current: routeName === 'Home' }"
                    ></i>
                </router-link>
            </div>
            <div class="mr-2">
                <router-link to="/recipes">
                    <i
                        class="las la-search"
                        :class="{ current: routeName === 'RecipesMainView' }"
                    ></i>
                </router-link>
            </div>
            <div class="ml-2">
                <router-link to="/profile/myWeekPlan">
                    <i
                        class="las la-calendar-week"
                        :class="{ current: routeName === 'myWeekPlan' }"
                    ></i>
                </router-link>
            </div>
            <div>
                <router-link to="/profile">
                    <i
                        class="las la-user-circle"
                        :class="{ current: routeName === 'Profile' }"
                    ></i>
                </router-link>
            </div>
        </div>
    </footer>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'Footer',

    setup() {
        const route = useRoute();
        const routeName = computed(() => route.name);
        return {
            routeName,
        };
    },
});
</script>

<style scoped>
i {
    color: black;
}
i.current {
    color: var(--accent-color);
}
.add-recipe {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--accent-color);
    border-radius: 60px;
    height: 60px;
    width: 60px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9;
}

#mobile-sticky-footer {
    display: flex;
    width: 100%;
    height: 55px;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: var(--background-contrast-color);
    box-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
}
#mobile-sticky-footer > div {
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    width: 25%;
    align-items: center;
    justify-content: center;
}
#mobile-sticky-footer > div > * {
    width: 100%;
}

@media only screen and (min-width: 769px) {
    #mobile-sticky-footer,
    .add-recipe {
        display: none;
    }
}
</style>
