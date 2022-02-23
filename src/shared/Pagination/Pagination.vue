<template>
	<div class="pagination-container">
		<div class="pagination-inner-container">
			<Button
				v-if="currentPage > 1"
				@click="previousPage"
				class="mr-05"
				title="previous page"
			>
				<i class="las la-angle-left"></i>
			</Button>
			<div
				v-if="currentPage"
				class="numbers"
				:class="{
					'empty-left': currentPage <= 1,
					'empty-right': !nextPageExists,
				}"
			>
				<span v-if="currentPage > 1" class="previous">
					{{ currentPage - 1 }}
				</span>
				<span class="current">{{ currentPage }}</span>
				<span v-if="nextPageExists" class="next">
					{{ currentPage + 1 }}
				</span>
			</div>
			<Button
				v-if="nextPageExists"
				@click="nextPage"
				class="ml-05"
				title="next page"
			>
				<i class="las la-angle-right"></i>
			</Button>
		</div>
	</div>
</template>

<script lang="ts">
import { PaginationStatekey } from '@/injectionKeys';
import { defineComponent, inject } from 'vue';

export default defineComponent({
	name: 'Pagination',

	props: {
		nextPageExists: Boolean,
	},

	emits: ['previousPage', 'nextPage'],

	setup(_, { emit }) {
		const paginationState = inject(PaginationStatekey)!;
		const { currentPage } = paginationState;

		return {
			currentPage,
			previousPage() {
				emit('previousPage');
			},
			nextPage() {
				emit('nextPage');
			},
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
</style>
