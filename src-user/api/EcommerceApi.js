import axios from 'axios';

const api = axios.create({
	baseURL: `${process.env.VUE_APP_ECOMMERCE_API_URL}/api`,
	withCredentials: false,
});

export const getStoreProducts = async (storeId) => {
	const { data } = await api.get(`/stores/${storeId}/products`);

	return data;
};

export const getCheckoutUrl = async ({
	productIds,
	successUrl,
	cancelUrl,
	storeId,
}) => {
	const { data } = await api.post(`/stores/${storeId}/checkout`, {
		productIds,
		successUrl,
		cancelUrl,
	});

	return data.sessionUrl;
};
