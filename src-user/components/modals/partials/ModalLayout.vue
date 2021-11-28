<template>
	<Transition name="fade">
		<FocusTrap :initial-focus="() => $refs.modal">
			<div class="modal-wrapper">
				<div
					tabindex="-1"
					class="modal-backdrop"
					@click="handleCloseModalAction"
				/>
				<div
					ref="modal"
					class="modal"
					tabindex="0"
					aria-modal="true"
					@keydown.esc="handleCloseModalAction"
				>
					<CloseButton
						class="modal__close-button"
						@click.native="handleCloseModalAction"
					/>
					<slot />
				</div>
			</div>
		</FocusTrap>
	</Transition>
</template>

<script>
import CloseButton from '@site-modules/components/CloseButton.vue';
import { useModal } from '@user/components/modals/useModal';

export default {
	components: {
		CloseButton,
	},
	setup() {
		const { closeModal } = useModal();

		return {
			closeModal,
		};
	},
	methods: {
		handleCloseModalAction() {
			this.closeModal();
			// to remove query that opens the modal
			this.$router.replace({
				query: {
					...this.$route.query,
					'open-modal': undefined,
				},
			}).catch((error) => {
				if (error.name !== 'NavigationDuplicated') throw error;
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.modal-wrapper {
	position: fixed;
	top: 50%;
	left: 50%;
	z-index: z-index(user--modal-overlay);
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100vw;
	height: 100vh;
	transform: translate(-50%, -50%);

	@include zyro-media($media-grid) {
		padding: 0 16px;
	}
}

.modal-backdrop {
	position: absolute;
	width: 100%;
	height: 100%;
	cursor: pointer;
	background-color: rgba($dark, 0.5);
}

.modal {
	z-index: 1;
	display: flex;
	flex-direction: column;
	min-width: 540px;
	padding: 16px;
	font-family: var(--font-primary);
	text-align: center;
	background-color: $light;
	outline: none;

	@include zyro-media($media-grid) {
		min-width: unset;
	}

	&__close-button {
		align-self: flex-end;
	}
}
</style>
