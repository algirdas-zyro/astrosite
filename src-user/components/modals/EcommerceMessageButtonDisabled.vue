<template>
	<Transition name="fade">
		<div class="notification">
			<svg
				class="notification__icon"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M12.01 16L12.01 12"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M12.01 8L12 8"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="notification__content">
				Zyro ecommerce checkout is disabled in preview mode.
			</p>
			<CloseButton
				class="notification__close"
				title="Close"
				@click.native="closeModal()"
			/>
		</div>
	</Transition>
</template>

<script>
import {
	onMounted,
	ref,
} from 'vue-demi';

import CloseButton from '@site-modules/components/CloseButton.vue';
import { useModal } from '@user/components/modals/useModal';

export default {
	components: {
		CloseButton,
	},
	setup() {
		const { closeModal } = useModal();
		const timeout = ref(null);

		onMounted(() => {
			timeout.value = setTimeout(() => {
				closeModal();
			}, 6000);
		});

		return {
			closeModal,
			timeout,
		};
	},
	beforeDestroy() {
		clearTimeout(this.timeout);
	},
};
</script>

<style lang="scss" scoped>
.notification {
	position: fixed;
	top: 16px;
	right: 20px;
	z-index: z-index(toasts);
	display: flex;
	align-items: flex-start;
	max-width: 400px;
	padding: 16px;
	margin-top: 16px;
	font-size: 14px;
	color: $light;
	background-color: $accent-two;
	border-radius: $border-radius-small;
	transition: all 0.5s ease-in-out;

	&__content {
		position: relative;
		display: flex;
		justify-content: flex-end;
		padding: 8px 16px;
		border-right: 1px solid $light;
	}

	&__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 42px;
		height: 34px;
		margin-left: 8px;
		color: $light;
		border-radius: 100px;

		&:hover {
			background-color: $accent-two-hover;
		}
	}

	&__icon {
		align-self: center;
	}
}

.fade-enter-active {
	transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
