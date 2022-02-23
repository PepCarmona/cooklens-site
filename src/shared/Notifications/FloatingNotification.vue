<template>
	<transition name="fade">
		<div
			v-if="showNotification"
			class="floating-notification"
			:class="notificationType"
		>
			<span class="text">{{ notificationMessage }}</span>
			<Button
				v-if="!autoCloseNotification"
				class="close"
				@click="closeNotification"
			>
				<i class="las la-times"></i>
			</Button>
		</div>
	</transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import createNotificationState from '@/shared/Notifications/NotifiactionState';

export default defineComponent({
	setup() {
		return {
			...createNotificationState(),
		};
	},
});
</script>

<style lang="scss" scoped>
.floating-notification {
	flex-direction: row !important;
	position: absolute;
	top: 1rem;
	left: 1rem;
	right: 1rem;
	border-radius: 0.5rem;
	padding: 1rem;
	z-index: 999;
	&.error {
		background-color: var(--light-error-color);
		box-shadow: 0 0 5px 0px var(--shadow-color);
		& * {
			color: var(--error-color);
		}
	}

	&.warning {
		background-color: var(--light-warning-color);
		box-shadow: 0 0 3px 0 var(--warning-color);
		& * {
			color: var(--warning-color);
		}
	}

	&.success {
		background-color: var(--light-success-color);
		box-shadow: 0 0 3px 0 var(--success-color);
		& * {
			color: var(--success-color);
		}
	}

	&.dark {
		background-color: var(--accent-color-complementary);
		box-shadow: 0 0 3px 0 var(--background-contrast-color);
		& * {
			color: var(--background-contrast-color);
		}
	}

	&.light {
		background-color: var(--background-contrast-color);
		box-shadow: 0 0 3px 0 var(--accent-color-complementary);
		& * {
			color: var(--accent-color-complementary);
		}
	}
}

.close {
	margin-left: auto;
	& > i {
		font-size: 20px;
	}
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
