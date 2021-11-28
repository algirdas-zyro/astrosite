<template>
	<Component
		:is="openModalComponent"
		v-if="openModalComponent"
	/>
</template>

<script>
import { useModal } from '@user/components/modals/useModal';

const OPEN_MODAL_QUERY_PARAM = 'open-modal';

export default {
	setup() {
		const {
			openModal,
			closeModal,
			openModalComponent,
		} = useModal();

		return {
			openModal,
			closeModal,
			openModalComponent,
		};
	},
	mounted() {
		const queryModalName = this.$route.query[OPEN_MODAL_QUERY_PARAM];

		if (queryModalName) {
			this.openModal({
				name: queryModalName,
			});
		}
	},
};
</script>
