<template>
	<GridButton
		tag-name="button"
		:content="content"
		data-qa="button-stripe-checkout"
		:type="type"
		:is-disabled="isLoadingStripeScript"
		@click="handleClick"
	/>
</template>

<script>

import {
	ref,
	getCurrentInstance,
} from 'vue-demi';

import GridButton from '@site-modules/components/elements/button/GridButton.vue';
import { useGridButton } from '@site-modules/components/elements/button/useGridButton';
import { useStripeGridButton } from '@site-modules/components/elements/button/useGridStripeButton';

const STRIPE_JS_URL = 'https://js.stripe.com/v3';

export default {
	name: 'GridStripeButtonProviderUser',
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
		const {
			content,
			type,
		} = useGridButton(props);

		const {
			stripeInstance,
			priceId,
			successPageSlug,
			cancellationPageSlug,
			paymentType,
		} = useStripeGridButton(props);

		const isLoadingStripeScript = ref(false);

		const { siteMeta } = getCurrentInstance()?.proxy?.$store?.getters ?? {};

		// Loads and appends stripe script to DOM
		const loadScript = () => new Promise((resolve, reject) => {
			const isStripeLoaded = !!(stripeInstance.value && window.Stripe);

			if (isStripeLoaded) {
				resolve();

				return;
			}

			const script = document.createElement('script');

			script.addEventListener('load', () => {
				if (window.Stripe) {
					stripeInstance.value = window.Stripe(siteMeta.stripePublicApiKey);
					resolve();
				}
			});

			script.addEventListener('error', () => {
				reject();
			});

			// Stripe docs require to always load from this url
			script.src = STRIPE_JS_URL;

			document.head.appendChild(script);
		});

		// Triggers load script, redirects to checkout
		const handleClick = async () => {
			if (!priceId.value) {
				return;
			}

			isLoadingStripeScript.value = true;

			await loadScript();

			isLoadingStripeScript.value = false;

			stripeInstance.value.redirectToCheckout({
				lineItems: [
					{
						price: priceId.value,
						quantity: 1,
					},
				],
				mode: paymentType.value,
				/**
				 * TODO:
				 * What to do in builder?
				 * Add default pages
				 */
				successUrl: `${window.location.origin}/${successPageSlug.value}`,
				cancelUrl: `${window.location.origin}/${cancellationPageSlug.value}`,
			})
				.then((result) => {
					if (result.error) {
						// eslint-disable-next-line no-console
						console.error(result.error.message);
					}
				});
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
