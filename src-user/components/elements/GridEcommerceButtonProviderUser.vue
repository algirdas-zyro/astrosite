<template>
	<GridButton
		tag-name="button"
		:content="content"
		data-qa="button-ecommerce-checkout"
		:type="type"
		:is-disabled="isLoadingStripeScript"
		:is-loading="isLoadingStripeScript"
		@click="handleClick"
	/>
</template>

<script>
import { ref } from 'vue-demi';

import GridButton from '@site-modules/components/elements/button/GridButton.vue';
import { useGridButton } from '@site-modules/components/elements/button/useGridButton';
import { useEcommerceGridButton } from '@site-modules/components/elements/button/useGridEcommerceButton';
import { getCheckoutUrl } from '@user/api/EcommerceApi';
import { useModal } from '@user/components/modals/useModal';

export default {
	name: 'GridEcommerceButtonProviderUser',
	components: {
		GridButton,
	},
	props: {
		data: {
			type: Object,
			required: true,
		},
	},
	setup(props) {
		const { openModal } = useModal(props);

		const {
			content,
			type,
		} = useGridButton(props);

		const {
			productId,
			returnPageSlug,
			storeId,
			isPreview,
		} = useEcommerceGridButton(props);

		const isLoadingStripeScript = ref(false);

		// Sends data to backend which return stripe checkout URL
		const handleClick = async () => {
			if (isPreview.value) {
				openModal({
					name: 'EcommerceMessageButtonDisabled',
				});

				return;
			}

			isLoadingStripeScript.value = true;

			const returnUrl = `${window.location.origin}/${returnPageSlug.value}`;
			const successUrl = `${returnUrl}?open-modal=EcommerceCheckoutSuccess`;

			try {
				const checkoutUrl = await getCheckoutUrl({
					productIds: [productId.value],
					successUrl,
					cancelUrl: returnUrl,
					storeId,
				});

				window.location.assign(checkoutUrl);
			} catch (error) {
				openModal({
					name: 'EcommerceCheckoutFailed',
				});
			} finally {
				isLoadingStripeScript.value = false;
			}
		};

		return {
			content,
			type,
			isLoadingStripeScript,
			handleClick,
		};
	},
};
</script>
