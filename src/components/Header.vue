<template>
    <header>
        <div id="logo">
            <img :src="logoUrl" alt="logo" />
        </div>
        <div id="title">Cooklens {{ width }}</div>
        <div id="menu">Menu</div>
    </header>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
    name: 'Header',

    setup() {
        const windowWidth = ref<number>(window.innerWidth);

        onMounted(() =>
            window.addEventListener(
                'resize',
                () => (windowWidth.value = window.innerWidth)
            )
        );

        return {
            logoUrl: computed(() =>
                windowWidth.value >= 768
                    ? 'https://via.placeholder.com/40/4d4d4d/ffffff.webp?text=X'
                    : 'https://via.placeholder.com/30/4d4d4d/ffffff.webp?text=X'
            ),
        };
    },
});
</script>

<style scoped>
header {
    display: flex;
    height: 50px;
    width: 100%;
    align-items: center;
    background-color: rgb(163, 163, 163);
}
#logo {
    display: flex;
    height: 100%;
    width: fit-content;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

#title {
    font-size: 1.3rem;
    font-weight: 600;
    text-align: left;
    width: 80%;
}

#menu {
    width: 20%;
    text-align: right;
    padding-right: 1rem;
}
@media only screen and (min-width: 768px) {
    header {
        height: 60px;
    }
    #title {
        font-size: 1.5rem;
        width: 40%;
    }
    #menu {
        width: 60%;
    }
}
</style>
