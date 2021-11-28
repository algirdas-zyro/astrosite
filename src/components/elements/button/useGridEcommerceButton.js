import {
	getCurrentInstance,
	computed,
} from 'vue-demi';

const PREVIEW_ORIGIN_URLS = [
	`${process.env.VUE_APP_BUILDER_URL}($|/.*)`,
	`${process.env.VUE_APP_WWW_URL}($|/.*)`,
];

export const useEcommerceGridButton = (props) => {
	const { $store } = getCurrentInstance()?.proxy ?? {};

	const storeProducts = computed(() => $store.state.ecommerce?.products);
	const productId = computed(() => props.data.settings?.productId);
	const storeId = $store.getters.siteMeta?.ecommerceStoreId;

	const defaultPages = $store.getters['pages/defaultPages'];
	const returnPageSlug = computed(() => (
		defaultPages[props.data.settings?.returnPageId] || Object.values(defaultPages)[0]).slug);
	const isPreview = computed(() => {
		const isDifferentLocation = window.location !== window.parent.location;
		const locationDomain = document.referrer;

		const isInZyroIframe = PREVIEW_ORIGIN_URLS.some((item) => locationDomain.match(item));

		return isDifferentLocation && isInZyroIframe;
	});

	return {
		storeProducts,
		productId,
		returnPageSlug,
		storeId,
		isPreview,
	};
};
