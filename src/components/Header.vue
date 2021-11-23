<template>
    <header>
        <div id="menu-mobile" class="menu">
            <span @click="showMenu = true"><i class="las la-bars"></i></span>
            <div class="slide-menu-mobile">
                <transition name="fade">
                    <div v-if="showMenu" class="overlay"></div>
                </transition>
                <transition name="slide">
                    <div
                        v-if="showMenu"
                        class="slideMenu d-flex justify-center"
                    >
                        <div>
                            <span class="menuTitle">MENU</span>
                            <span class="menuClose" @click="showMenu = false">
                                <i class="las la-times"></i>
                            </span>
                            <div class="items">
                                <!-- <router-link @click="showMenu = false" to="/"
                                    >Home</router-link
                                > -->
                                <router-link
                                    @click="showMenu = false"
                                    to="/recipes"
                                    >Recipes</router-link
                                >
                                <router-link
                                    @click="showMenu = false"
                                    to="/about"
                                    >About</router-link
                                >
                                <!-- <router-link
                                    @click="showMenu = false"
                                    to="/recipe/random?random=true"
                                    >Random</router-link
                                > -->
                                <!-- <span
                                    v-if="!!authenticatedUser"
                                    @click="
                                        logOut();
                                        showMenu = false;
                                    "
                                >
                                    Log Out
                                </span> -->
                                <router-link
                                    v-if="!!authenticatedUser"
                                    to="/profile"
                                >
                                    My Profile
                                </router-link>
                                <router-link
                                    v-else
                                    @click="showMenu = false"
                                    to="/login"
                                    >Login</router-link
                                >
                                <router-link
                                    @click="showMenu = false"
                                    to="/recipe/form"
                                    >Add recipe</router-link
                                >
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <div id="title">
            <router-link to="/">Cooklens</router-link>
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useAuthState from '@/store/auth-state';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'Header',

    setup() {
        const router = useRouter();

        const showMenu = ref(false);
        const { authenticatedUser } = useAuthState();

        function logOut() {
            useAuthState()
                .logOut()
                .then(() => {
                    router.push({ name: 'Home' });
                });
        }

        return {
            showMenu,
            authenticatedUser,
            logOut,
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
    z-index: 9;
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
    color: var(--main-dark-color);
    text-decoration: none;
    font-size: 24px;
    font-family: var(--title-font);
    font-weight: 200;
}

.menu {
    width: 4rem;
    flex-shrink: 0;
}
.menu a {
    font-weight: bold;
    color: var(--text-main-color);
}
.menu a.router-link-exact-active {
    color: var(--main-light-color);
}
.menu > span {
    cursor: pointer;
}
.menuTitle {
    display: block;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--main-light-color);
    margin-top: 3rem;
    margin-bottom: 1rem;
}
.menuClose {
    position: absolute;
    top: 1rem;
    left: -3rem;
    cursor: pointer;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: var(--secondary-transparent-color);
    z-index: 9;
}

.slideMenu {
    flex-wrap: wrap;
    position: absolute;
    top: 0;
    right: 0;
    height: 100vh;
    width: 75vw;
    z-index: 10;
    background-color: var(--terciary-color);
}
.slideMenu > div {
    height: fit-content;
    width: 80%;
}
.slideMenu > div > * {
    text-align: left;
}
.slideMenu .items {
    display: flex;
    flex-wrap: wrap;
}
.slideMenu .items > * {
    width: 100%;
    padding: 1rem;
    border-bottom: 1px solid var(--secondary-color);
    text-align: left;
    font-size: 1rem;
    font-weight: 100;
    text-decoration: none;
    color: var(--secondary-light-color);
    background-color: transparent;
    outline: none;
}
.slideMenu .items > *:last-child {
    border: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.6s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.6s;
}
.slide-leave-to,
.slide-enter-from {
    transform: translateX(100vw);
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
}
</style>
