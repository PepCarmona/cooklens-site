<template>
    <header>
        <div id="logo">
            <router-link to="/"><img :src="logoUrl" alt="logo" /></router-link>
        </div>
        <div id="title">
            <router-link to="/">Cooklens</router-link>
        </div>
        <div v-if="isMobile" id="menu-mobile" class="menu">
            <span @click="showMenu = true"><MenuIcon size="l" /></span>
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
                            <span class="menuClose" @click="showMenu = false"
                                ><CloseIcon size="xl"
                            /></span>
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
                                    to="/recipe/add"
                                    >Add recipe</router-link
                                >
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <div v-else id="menu-desktop" class="menu">
            <router-link to="/recipes">Recipes</router-link>
            <router-link to="/about">About</router-link>
            <!-- <router-link to="/recipe/random?random=true">Random</router-link> -->
            <!-- <span v-if="!!authenticatedUser" @click="logOut">Log Out</span> -->
            <router-link v-if="!!authenticatedUser" to="/profile">
                My Profile
            </router-link>
            <router-link v-else to="/login">Login</router-link>
            <router-link to="/recipe/add">Add recipe</router-link>
        </div>
    </header>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import {
    EOS_MENU as MenuIcon,
    EOS_CLOSE_OUTLINED as CloseIcon,
} from 'eos-icons-vue3';
import useAuthState from '@/store/auth-state';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'Header',

    components: {
        MenuIcon,
        CloseIcon,
    },

    setup() {
        const router = useRouter();

        const showMenu = ref(false);
        const windowWidth = ref<number>(window.innerWidth);
        const { authenticatedUser } = useAuthState();

        onMounted(() =>
            window.addEventListener(
                'resize',
                () => (windowWidth.value = window.innerWidth)
            )
        );

        function logOut() {
            useAuthState()
                .logOut()
                .then(() => {
                    router.push({ name: 'Home' });
                });
        }

        return {
            showMenu,
            logoUrl: computed(() =>
                windowWidth.value >= 768
                    ? 'https://via.placeholder.com/40/4d4d4d/ffffff.webp?text=X'
                    : 'https://via.placeholder.com/30/4d4d4d/ffffff.webp?text=X'
            ),
            isMobile: computed(() => windowWidth.value < 768),
            authenticatedUser,
            logOut,
        };
    },
});
</script>

<style scoped>
header {
    display: flex;
    height: 50px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}

#logo {
    display: flex;
    height: 100%;
    width: fit-content;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}
#logo > a {
    display: flex;
}

#title {
    font-size: 1.3rem;
    font-weight: 600;
    text-align: center;
    width: fit-content;
}
#title > a {
    color: black;
    text-decoration: none;
}

.menu {
    display: flex;
    height: 100%;
    width: fit-content;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}
.menu a {
    font-weight: bold;
    color: #2c3e50;
}
.menu a.router-link-exact-active {
    color: #42b983;
}
.menu > span {
    cursor: pointer;
}
.menuTitle {
    display: block;
    font-size: 1.3rem;
    font-weight: 600;
    color: white;
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
    background-color: rgba(255, 255, 255, 0.75);
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
    background-color: gray;
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
    border-bottom: 1px solid lightgrey;
    text-align: left;
    font-size: 1rem;
    font-weight: 100;
    text-decoration: none;
    color: rgb(236, 236, 236);
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

#menu-desktop {
    display: flex;
    justify-content: flex-end;
}
#menu-desktop > * {
    width: fit-content;
    padding-left: 1rem;
    padding-right: 1rem;
    background-color: transparent;
    font-size: 1rem;
    font-weight: 100;
    text-decoration: none;
    color: black;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
}
@media only screen and (min-width: 767px) {
    header {
        height: 60px;
    }
    #title {
        font-size: 1.5rem;
        text-align: left;
        width: 40%;
        position: relative;
    }

    .menu {
        display: block;
        width: 60%;
        text-align: right;
        padding-right: 1rem;
    }
}
</style>
