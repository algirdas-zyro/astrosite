<template>
	<ModalLayout
		v-if="isSiteWithEcommerceElements"
		ref="modal"
	>
		<ModalContent
			title="We can’t accept online orders right now"
			text="Please contact us to complete your purchase."
			button-text="Close"
			@handle-close="$refs.modal.handleCloseModalAction()"
		/>
	</ModalLayout>
</template>

<script>
import { mapGetters } from 'vuex';

import ModalLayout from '@user/components/modals/partials/ModalLayout.vue';
import ModalContent from '@user/components/modals/partials/ecommerce/ModalContent.vue';

export default {
	components: {
		ModalLayout,
		ModalContent,
	},
	computed: {
		...mapGetters('ecommerce', ['isSiteWithEcommerceElements']),
	},
};
</script>
