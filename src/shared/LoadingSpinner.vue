<template>
	<i class="las la-circle-notch" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	setup() {
		return {};
	},
});
</script>

<style lang="scss" scoped>
i {
	height: 24px;
	width: 24px;
	animation: spin 1s infinite linear;
}
@keyframes spin {
	100% {
		transform: rotate(360deg);
	}
}
</style>
