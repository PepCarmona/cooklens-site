<template>
	<div class="pagination-container">
		<Button
			v-if="hasNextPage"
			@click="$emit('load-more')"
			title="load more"
			class="loadMore"
		>
			load more
		</Button>
	</div>
</template>

<script lang="ts">
import { PaginationStatekey } from '@/injectionKeys';
import { defineComponent, inject } from 'vue';

export default defineComponent({
	name: 'Pagination',

	props: {
		hasNextPage: Boolean,
	},

	emits: ['load-more'],

	setup() {
		const paginationState = inject(PaginationStatekey)!;
		const { currentPage } = paginationState;

		return {
			currentPage,
		};
	},
});
</script>

<style lang="scss" scoped>
button:hover {
	background-color: transparent;
}
i {
	font-size: 16px;
}
.pagination-container {
	width: 100%;
	display: flex;
	justify-content: center;
	flex-grow: 1;
	align-items: flex-end;
}

.pagination-inner-container {
	width: 115px;
	display: flex;
	align-items: center;
}

.numbers {
	width: 32px;
}
.current {
	font-size: 1.2rem;
	font-weight: 600;
}
.previous,
.next {
	font-size: 0.8rem;
}
.previous {
	margin-right: 0.2rem;
}
.next {
	margin-left: 0.2rem;
}

.empty-left {
	margin-left: calc(0.5rem + 16px);
	text-align: right;
}
.empty-right {
	margin-right: calc(0.5rem + 16px);
	text-align: left;
}

.loadMore {
	color: var(--accent-color);
	text-decoration: underline;
	height: 50px;
}
</style>
