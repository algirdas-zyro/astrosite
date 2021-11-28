import {
	ref,
	getCurrentInstance,
	computed,
} from 'vue-demi';

// Use one instance for all buttons
const stripeInstance = ref(null);

// One time payment with checkout docs:
// https://stripe.com/docs/payments/checkout/client

export const useStripeGridButton = (props) => {
	const priceId = computed(() => props.data.settings?.priceId || '');
	const paymentType = computed(() => props.data.settings?.paymentType || 'payment');
	const defaultPages = getCurrentInstance()?.proxy.$store.getters['pages/defaultPages'];
	const successPageSlug = computed(() => (
		defaultPages[props.data.settings?.successPageId] || Object.values(defaultPages)[0]).slug);
	const cancellationPageSlug = computed(() => (
		defaultPages[props.data.settings?.cancellationPageId] || Object.values(defaultPages)[0]).slug);

	return {
		stripeInstance,
		priceId,
		paymentType,
		successPageSlug,
		cancellationPageSlug,
	};
};
