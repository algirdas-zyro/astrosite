import { getStoreProducts } from '@user/api/EcommerceApi';

// mutation type constants:
export const SET_STORE_PRODUCTS = 'SET_STORE_PRODUCTS';
export const SET_IS_LOADING = 'SET_IS_LOADING';

export default {
	namespaced: true,
	state: {
		products: [],
		isLoading: false,
	},
	getters: {
		isSiteWithEcommerceElements: (state, getters, rootState, rootGetters) => {
			const { siteElements } = rootGetters;

			return Object.values(siteElements).some((value) => value?.type === 'GridEcommerceButton');
		},
	},
	mutations: {
		[SET_IS_LOADING](state, isLoading) {
			state.isLoading = isLoading;
		},
		[SET_STORE_PRODUCTS](state, products) {
			state.products = products;
		},
	},
	actions: {
		getProducts: async ({
			commit,
			rootGetters,
		}) => {
			const { ecommerceStoreId } = rootGetters.siteMeta;

			if (!ecommerceStoreId) {
				return;
			}

			commit(SET_IS_LOADING, true);

			try {
				const storeProducts = await getStoreProducts(ecommerceStoreId);

				commit(SET_STORE_PRODUCTS, storeProducts);
			} catch (error) {
				console.error(error);
			}

			commit(SET_IS_LOADING, false);
		},
	},
};
