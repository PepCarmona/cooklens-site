<template>
    <div class="title">
        <button @click="back" class="back">
            <ArrowBackIcon size="l" />
        </button>
        <h2>My Week Plan</h2>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EOS_WEST as ArrowBackIcon } from 'eos-icons-vue3';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'MyWeekPlan',

    components: {
        ArrowBackIcon,
    },

    setup() {
        const router = useRouter();

        function back() {
            router.push({
                name: 'Profile',
            });
        }
        return {
            back,
        };
    },
});
</script>

<style scoped>
.back {
    padding: 0.5rem 1rem;
    position: absolute;
    left: 1rem;
}

.title {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
}
</style>
