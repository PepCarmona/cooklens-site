<template>
	<transition name="fade">
		<div
			v-if="showNotification"
			class="floating-notification"
			:class="notificationType"
		>
			<span class="text">{{ notificationMessage }}</span>
			<button
				v-if="!autoCloseNotification"
				class="close"
				@click="closeNotification"
			>
				<i class="las la-times"></i>
			</button>
		</div>
	</transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useNotificationState from '@/shared/Notifications/NotifiactionState';

export default defineComponent({
	setup() {
		return {
			...useNotificationState(),
		};
	},
});
</script>

<style scoped>
.floating-notification {
	flex-direction: row !important;
	position: absolute;
	top: 1rem;
	left: 1rem;
	right: 1rem;
	border-radius: 0.5rem;
	padding: 1rem;
	z-index: 999;
}
.floating-notification.error {
	background-color: var(--light-error-color);
	box-shadow: 0 0 5px 0px var(--shadow-color);
}
.floating-notification.error * {
	color: var(--error-color);
}

.floating-notification.warning {
	background-color: var(--light-warning-color);
	box-shadow: 0 0 3px 0 var(--warning-color);
}
.floating-notification.warning * {
	color: var(--warning-color);
}

.floating-notification.success {
	background-color: var(--light-success-color);
	box-shadow: 0 0 3px 0 var(--success-color);
}
.floating-notification.success * {
	color: var(--success-color);
}

.floating-notification.dark {
	background-color: var(--accent-color-complementary);
	box-shadow: 0 0 3px 0 var(--background-contrast-color);
}
.floating-notification.dark * {
	color: var(--background-contrast-color);
}

.floating-notification.light {
	background-color: var(--background-contrast-color);
	box-shadow: 0 0 3px 0 var(--accent-color-complementary);
}
.floating-notification.light * {
	color: var(--accent-color-complementary);
}

.close {
	margin-left: auto;
}
.close > i {
	font-size: 20px;
}

.fade-enter-active {
	transition: all 0.4s;
}
.fade-leave-active {
	transition: all 0.8s;
}

.fade-enter-from {
	opacity: 0.6;
	transform: translateY(-10vh);
}

.fade-leave-to {
	opacity: 0;
	transform: translateY(-5vh);
}
</style>
