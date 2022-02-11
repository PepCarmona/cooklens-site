<template>
	<button
		@click.stop="!loading && $emit('click')"
		:class="{ loading, primary, secondary, 'secondary-light': secondaryLight }"
		:disabled="loading"
	>
		<LoadingSpinner v-if="loading" />
		<slot v-else />
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import LoadingSpinner from '@/shared/LoadingSpinner.vue';

export default defineComponent({
	name: 'Button',

	props: {
		loading: Boolean,
		primary: Boolean,
		secondary: Boolean,
		secondaryLight: Boolean,
	},

	components: {
		LoadingSpinner,
	},

	emits: ['click'],

	setup() {
		return {};
	},
});
</script>

<style lang="scss" scoped>
button {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: transparent;
	border: none;
	outline: none;
	padding: 1rem;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 200ms linear;
	&:focus {
		background-color: var(--grey-100);
	}
	&:hover {
		background-color: var(--grey-100);
	}
}

button.primary {
	background-color: var(--accent-color);
	&:disabled {
		background-color: var(--accent-color-light) !important;
		cursor: progress;
	}
	&:focus {
		background-color: var(--accent-color-hover);
	}
	&:hover {
		background-color: var(--accent-color-hover);
	}
}
button.secondary {
	background-color: var(--accent-color-complementary);
}
button.secondary-light {
	background-color: var(--grey-800);
}

button.primary,
button.secondary,
button.secondary-light,
button.primary *,
button.secondary *,
button.secondary-light * {
	color: var(--inverted-text-color);
}
</style>
