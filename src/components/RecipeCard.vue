<template>
    <div class="card">
        <div class="image">
            <img
                src="https://via.placeholder.com/400x300.webp"
                :alt="recipe.title"
            />
        </div>
        <div class="content d-flex p-1">
            <div class="row">
                <div class="title w-80 text-left">{{ recipe.title }}</div>
                <div class="w-20 d-flex align-items-center justify-end">
                    <FavIcon size="l" />
                    <LikeIcon class="ml-05" size="l" />
                </div>
            </div>
            <div class="row mt-2">
                <div class="w-50 text-left">
                    <FilledStar size="l" />
                    <FilledStar size="l" />
                    <FilledStar size="l" />
                    <HalfStar size="l" />
                    <EmptyStar size="l" />
                </div>
                <div class="mt-2 w-50 d-flex justify-end align-center">
                    <ClockIcon size="l" />
                    <span class="ml-05">{{ formattedTime }}</span>
                </div>
            </div>
            <div class="row">
                <div
                    class="pill mx-05"
                    v-for="tag in recipe.tags"
                    :key="tag._id"
                >
                    {{ tag.value }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Recipe } from '@/api/recipes/recipe';
import { computed, defineComponent, PropType } from 'vue';
import {
    EOS_FAVORITE_OUTLINED as FavIcon,
    EOS_THUMB_UP_OUTLINED as LikeIcon,
    EOS_SCHEDULE_OUTLINED as ClockIcon,
    EOS_STAR_FILLED as FilledStar,
    EOS_STAR_HALF_FILLED as HalfStar,
    EOS_STAR_OUTLINED as EmptyStar,
} from 'eos-icons-vue3';

export default defineComponent({
    name: 'RecipeCard',

    components: {
        FavIcon,
        LikeIcon,
        ClockIcon,
        FilledStar,
        HalfStar,
        EmptyStar,
    },

    props: {
        recipe: {
            type: Object as PropType<Recipe>,
            required: true,
        },
    },

    setup(props) {
        const formattedTime = computed(() => {
            const totalTime = props.recipe.time.preparation
                ? props.recipe.time.preparation + props.recipe.time.cooking
                : props.recipe.time.cooking;

            const hours = Math.floor(totalTime / 60);
            const minutes = totalTime % 60;

            const formattedTime =
                hours > 0 ? `${hours} h  ${minutes} min` : `${minutes} min`;

            return formattedTime;
        });
        return {
            formattedTime,
        };
    },
});
</script>

<style scoped>
.card {
    max-width: 400px;
    border: 1px solid grey;
    margin-top: 1rem;
    margin-bottom: 1rem;
}
.image > img {
    width: 100%;
}
.content {
    flex-wrap: wrap;
}
.title {
    font-size: 1.2rem;
    font-weight: 600;
}

.pill {
    position: relative;
    width: fit-content;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    background: grey;
    border-radius: 20px;
    color: white;
}
</style>
