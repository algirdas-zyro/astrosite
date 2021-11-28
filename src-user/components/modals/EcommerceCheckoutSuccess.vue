<template>
	<ModalLayout
		v-if="isSiteWithEcommerceElements"
		ref="modal"
	>
		<ModalContent
			title="Thank you for your order"
			text="Your order has been received. It will be processed shortly."
			button-text="Got it"
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
