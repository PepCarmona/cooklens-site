<template>
    <header>
        <div id="logo">
            <img
                src="https://via.placeholder.com/25/4d4d4d/ffffff.webp?text=X"
            />
            <!-- <div class="img"></div> -->
        </div>
        <div id="title">Cooklens</div>
        <div id="menu">Menu</div>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Header',

    setup() {
        return {};
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
    width: 20%;
    align-items: center;
    justify-content: center;
}

#title {
    font-size: 1.3rem;
    font-weight: 600;
    text-align: left;
    width: 80%;
}

#menu {
    width: 20%;
}
</style>
