<template>
    <div class="header">
        <div>
            <span class="back" @click="$emit('go-back')">
                <i class="las la-angle-left"></i>
            </span>
            <span class="title">
                <slot name="title"></slot>
            </span>
            <div class="actions">
                <slot name="actions"></slot>
            </div>
        </div>
        <div>
            <slot name="second-row"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'PageHeader',

    emits: ['go-back'],

    setup() {
        return {};
    },
});
</script>

<style scoped>
.header {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
    line-height: 60px;
    padding: 1rem;
    padding-bottom: 0;
    border-bottom: 1px solid var(--shadow-color);
    background-color: var(--background-contrast-color);
}
.header > div {
    width: 100%;
    display: flex;
    align-items: flex-end;
}
.header > div:first-child {
    padding-bottom: 1rem;
}
.header .back > i {
    font-size: 20px;
}
.header .back,
.header .actions > * {
    cursor: pointer;
}
.header .actions {
    display: flex;
    width: fit-content;
    right: 1rem;
    min-width: 28px;
}
.header .title {
    font-family: var(--title-font);
    font-size: 20px;
    flex-grow: 1;
}
</style>
