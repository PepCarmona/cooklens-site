<template>
    <Header />
    <router-view />
    <Footer />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import useAuthState from './store/auth-state';

export default defineComponent({
    components: {
        Header,
        Footer,
    },

    setup() {
        onBeforeMount(() => useAuthState().checkSession());
        return {};
    },
});
</script>

<style>
@import './assets/styles/basic.css';
body,
html {
    margin: 0;
    padding: 0;
}
body * {
    box-sizing: border-box;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: var(--text-main-color);
    background-color: var(--background-color);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-bottom: 55px;
}
#app > div {
    flex-grow: 1;
}
@media only screen and (min-width: 769px) {
    #app {
        padding-bottom: 0;
    }
}
</style>
