<template>
    <CustomModal
        v-if="showHeader"
        :showIf="showMenu"
        @close="showMenu = false"
        :mode="'top'"
    >
        <div class="slide-menu">
            <span class="menu-close" @click="showMenu = false">
                <i class="las la-times"></i>
            </span>
            <router-link @click="showMenu = false" to="/" class="menu-title">
                Cooklens
            </router-link>
            <div class="items">
                <router-link @click="showMenu = false" to="/recipes"
                    >Recipes</router-link
                >
                <router-link @click="showMenu = false" to="/about"
                    >About</router-link
                >
                <router-link
                    @click="showMenu = false"
                    v-if="!!authenticatedUser"
                    to="/profile"
                >
                    My Profile
                </router-link>
                <router-link v-else @click="showMenu = false" to="/auth"
                    >Login</router-link
                >
                <router-link @click="showMenu = false" to="/recipe/form"
                    >Add recipe</router-link
                >
            </div>
        </div>
    </CustomModal>
    <header v-if="showHeader">
        <div id="menu-mobile" class="menu">
            <span @click="showMenu = true"><i class="las la-bars"></i></span>
        </div>
        <div id="title">
            <router-link to="/">Cooklens</router-link>
        </div>
    </header>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import useAuthState from '@/store/auth-state';
import { useRoute, useRouter } from 'vue-router';
import CustomModal from '@/components/shared/CustomModal.vue';

export default defineComponent({
    name: 'Header',

    components: {
        CustomModal,
    },

    setup() {
        const route = useRoute();

        const showMenu = ref(false);
        const showHeader = computed(() => route.name !== 'Authentication');
        const { authenticatedUser } = useAuthState();

        return {
            showMenu,
            showHeader,
            authenticatedUser,
        };
    },
});
</script>

<style scoped>
header {
    position: relative;
    display: flex;
    height: 50px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    z-index: 99;
    backdrop-filter: blur(32px);
}

#title {
    font-size: 1.3rem;
    font-weight: 600;
    text-align: center;
    width: 100%;
    padding-bottom: 4px;
    margin-left: -4rem;
}
#title > a {
    text-decoration: none;
    font-size: 24px;
    font-family: var(--title-font);
    font-weight: 200;
}

.menu {
    width: 4rem;
    flex-shrink: 0;
    z-index: 9;
}
.slide-menu a.router-link-exact-active {
    color: var(--accent-color);
}
.menu > span {
    cursor: pointer;
}
.menu-title {
    display: block;
    font-family: var(--title-font);
    font-weight: 200;
    font-size: 30px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    color: var(--accent-color);
}
.menu-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: var(--dark-shadow-color);
    backdrop-filter: blur(1px);
}

.slide-menu {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    height: fit-content;
    padding-bottom: 3rem;
    width: 100%;
}
.slide-menu .items {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}
.slide-menu .items > * {
    width: 100%;
    padding: 1rem;
    padding-left: 0;
    text-align: left;
}
.slide-menu .items > * {
    border-bottom: 1px solid var(--accent-color-transparent);
}
.slide-menu .items > *:last-child {
    border: 0;
}

@media only screen and (min-width: 767px) {
    header {
        height: 60px;
    }
    #title {
        text-align: left;
        position: relative;
        padding-bottom: 6px;
        margin-left: 0;
    }
    #title > a {
        font-size: 28px;
    }

    .menu {
        display: block;
        text-align: right;
        padding-right: 1rem;
    }

    .menu-close {
        left: 1rem;
        right: auto;
    }
    .menu-title {
        margin-top: -1.1rem;
        margin-left: 2.5rem;
        margin-bottom: 2rem;
    }
    .slide-menu {
        padding-bottom: 1rem;
    }
    .slide-menu .items {
        margin-left: 2rem;
    }
    .slide-menu .items > * {
        width: fit-content;
        border-bottom: none;
        border-right: 1px solid var(--accent-color-transparent);
        padding: 0.5rem 1rem;
    }
}
</style>
