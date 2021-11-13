<template>
    <footer>
        <div class="slide-footer" :class="{ hidden: !showFooter }">
            <i
                v-if="showFooter"
                class="las la-angle-down"
                style="color: white"
                @click="
                    selectedShowFooter = false;
                    showFooter = false;
                "
            ></i>
            <i
                v-else
                class="las la-angle-up mb-05 pt-05"
                style="color: white"
                @click="
                    selectedShowFooter = true;
                    showFooter = true;
                "
            ></i>
        </div>

        <transition name="slide">
            <div v-if="showFooter" id="mobile-sticky-footer">
                <div>
                    <router-link to="/">
                        <i class="las la-home"></i>
                    </router-link>
                </div>
                <div>
                    <router-link to="/profile/favRecipes">
                        <i class="lar la-heart"></i>
                    </router-link>
                </div>
                <div>
                    <router-link to="/profile/myWeekPlan">
                        <i class="las la-calendar-week"></i>
                    </router-link>
                </div>
                <div>
                    <router-link to="/profile">
                        <i class="las la-user-circle"></i>
                    </router-link>
                </div>
            </div>
        </transition>
    </footer>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
    name: 'Footer',

    setup() {
        const showFooter = ref(true);

        const selectedShowFooter = ref(true);

        onMounted(() =>
            window.addEventListener('resize', () => {
                if (window.innerHeight < 450) {
                    showFooter.value = false;
                }
                if (window.innerHeight >= 450 && selectedShowFooter.value) {
                    showFooter.value = true;
                }
            })
        );
        return {
            showFooter,
            selectedShowFooter,
        };
    },
});
</script>

<style scoped>
.slide-footer {
    position: fixed;
    left: 50%;
    bottom: 50px;
    background-color: var(--main-color);
    border-radius: 50px;
    height: 40px;
    width: 40px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(-50%, 50%);
    z-index: 11;
}
.slide-footer.hidden {
    bottom: 0;
    transform: translate(-50%, 0);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    height: 25px;
}

#mobile-sticky-footer {
    display: flex;
    width: 100%;
    height: 50px;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    box-shadow: 0 0 3px 1px grey;
    background-color: var(--main-transparent-color);
    /* border-top-right-radius: 20px;
    border-top-left-radius: 20px; */
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

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.6s;
}
.slide-leave-to,
.slide-enter-from {
    transform: translateY(60px);
}

@media only screen and (min-width: 769px) {
    #mobile-sticky-footer,
    .slide-footer {
        display: none;
    }
}
</style>
