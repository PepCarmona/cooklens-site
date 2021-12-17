<template>
	<div class="modalContent">
		<span class="mb-1"><slot /></span>
		<i class="las la-circle-notch m-auto"></i>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'LoadingModal',

	setup() {
		return {};
	},
});
</script>

<style scoped>
.modalContent > * {
	display: block;
}
.modalContent > span {
	font-size: 1.2rem;
	font-weight: 600;
}
</style>
