<template>
    <div class="rating-container">
        <div class="rating">
            <button
                v-for="rating in ratings"
                :key="rating"
                @click="rate(rating)"
                :class="{ disabled: onlyDisplay }"
            >
                <FilledStar v-if="recipeRating >= rating" :size="size" />
                <EmptyStar v-else :size="size" />
            </button>
        </div>
        <div v-if="clicked && showComment" class="comment">
            <textarea
                name="ta"
                id="ta"
                placeholder="Leave your optional comment"
            ></textarea>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import {
    EOS_STAR_FILLED as FilledStar,
    EOS_STAR_OUTLINED as EmptyStar,
} from 'eos-icons-vue3';

export default defineComponent({
    name: 'Rating',

    props: {
        recipeRating: {
            type: Number,
            required: true,
        },
        maxRating: {
            type: Number,
            default: 5,
        },
        size: {
            type: String,
            default: 'xl',
        },
        onlyDisplay: Boolean,
        showComment: Boolean,
    },

    components: {
        FilledStar,
        EmptyStar,
    },

    emits: ['rate'],

    setup(props, { emit }) {
        const clicked = ref(false);

        const ratings = computed(() => {
            let ratingArray = [];
            for (let i = 1; i <= props.maxRating; i++) {
                ratingArray.push(i);
            }
            return ratingArray;
        });

        function rate(number: number) {
            clicked.value = true;
            emit('rate', number);
        }
        return {
            clicked,
            ratings,
            rate,
        };
    },
});
</script>

<style scoped>
button:focus,
button:hover {
    background-color: transparent;
}
button.disabled {
    pointer-events: none;
}
textarea {
    width: 100%;
    min-height: 100px;
}
.rating-container {
    width: fit-content;
}
.rating {
    display: flex;
    justify-content: center;
}
</style>
