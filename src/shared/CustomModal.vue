<template>
	<transition name="master">
		<div v-show="showIf" class="modal-container">
			<transition name="fade">
				<div
					v-if="showIf"
					class="modal-overlay"
					:class="mode"
					@click.self="$emit('close')"
				/>
			</transition>
			<transition name="slide">
				<div v-if="showIf" class="modal" :class="classList">
					<Button v-if="mode === 'full'" class="close" @click="$emit('close')">
						<i class="las la-times"></i>
					</Button>
					<slot></slot>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

export type modalLateralMode =
	| 'left'
	| 'right'
	| 'bottom'
	| 'full'
	| 'center'
	| 'top';

export default defineComponent({
	name: 'CustomModal',

	props: {
		showIf: Boolean,
		transparent: Boolean,
		thin: Boolean,
		mode: {
			type: String as PropType<modalLateralMode>,
			default: 'center',
		},
		noPadding: Boolean,
	},

	emits: ['close'],

	setup(props) {
		const classList = computed(() => {
			const classList = [];
			if (props.transparent) {
				classList.push('transparent');
			}
			if (props.thin) {
				classList.push('thin');
			}
			if (props.noPadding) {
				classList.push('noPadding');
			}

			classList.push(props.mode);

			return classList.join(' ');
		});
		return { classList };
	},
});
</script>

<style lang="scss" scoped>
.modal-container {
	display: flex;
	position: fixed;
	height: 100vh;
	width: 100vw;
	top: 0;
	left: 0;
	z-index: 999;
	backdrop-filter: blur(1px);
}
.modal-overlay {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	background-color: var(--dark-shadow-color);
}

.modal {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	position: relative;
	margin: auto;
	height: fit-content;
	overflow-y: auto;
	overflow-x: hidden;
	width: calc(100% - 2rem);
	padding: 1.5rem;
	border-radius: 1rem;
	background-color: var(--background-contrast-color);
	z-index: 1000;
	&.center {
		max-height: calc(100% - 2rem);
	}
	&.transparent {
		border: none;
		background-color: transparent;
	}
	&.thin {
		padding: 1rem;
	}
	&.top {
		width: 100%;
		margin-top: 0;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
	&.left {
		height: 100vh;
		width: fit-content;
		max-width: 40%;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		margin-left: 0;
		align-items: flex-start;
	}
	&.full {
		margin: 0;
		width: 100vw;
		max-width: 100vw;
		height: 100vh;
		border-radius: 0;
		padding: 1rem;
	}
	&.noPadding {
		padding: 0;
	}
}

.master-enter-active,
.master-leave-active {
	transition: all 0.4s;
}
.master-enter-from,
.master-leave-to {
	opacity: 0.999;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
	transition: all 0.4s;
}
.center.slide-leave-to,
.center.slide-enter-from {
	transform: scale(0);
	opacity: 0;
}
.top.slide-leave-to,
.top.slide-enter-from {
	transform: translateY(-100vh);
}
.left.slide-leave-to,
.left.slide-enter-from {
	transform: translateX(-100vw);
}

.close {
	position: fixed;
	top: 1rem;
	right: 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 50px;
	width: 50px;
	border-radius: 50px;
	border: 1px solid var(--border-color);
	box-shadow: 0 0 5px 1px var(--shadow-color);
	background-color: var(--background-contrast-color);
}

@media only screen and (min-width: 767px) {
	.modal-overlay.right > .modal {
		width: 450px;
		border-left: 1px solid var(--main-dark-color);
	}
	.modal {
		width: fit-content;
		max-width: 90vw;
		&.top {
			max-width: 100vw;
		}
	}
	.close {
		right: 2rem;
	}
}
</style>
