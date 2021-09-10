<template>
    <footer>
        <div id="mobile-sticky-footer">
            <div>
                <HomeIcon size="xl" />
            </div>
            <div>
                <FavIcon size="xl" />
            </div>
            <div>
                <MealPlanIcon size="xl" />
            </div>
            <div>
                <ProfileIcon size="xl" />
            </div>
        </div>
    </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
    EOS_HOME_OUTLINED as HomeIcon,
    EOS_FAVORITE_OUTLINED as FavIcon,
    EOS_DATE_RANGE_OUTLINED as MealPlanIcon,
    EOS_PERSON_PIN_OUTLINED as ProfileIcon,
} from 'eos-icons-vue3';

export default defineComponent({
    name: 'Footer',

    components: {
        HomeIcon,
        FavIcon,
        MealPlanIcon,
        ProfileIcon,
    },

    setup() {
        return {};
    },
});
</script>

<style scoped>
#mobile-sticky-footer {
    display: flex;
    width: 100%;
    height: 50px;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    box-shadow: 0 0 3px 1px grey;
    background-color: rgba(212, 212, 212, 0.815);
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

@media only screen and (min-width: 768px) {
    #mobile-sticky-footer {
        display: none;
    }
}
</style>
