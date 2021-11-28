export default {
	namespaced: true,
	state: {
		navigationHeight: 0,
	},
	getters: {
		navigation: (state, getters, { website }) => website.navigation,
		items: (state, { navigation }) => navigation.items,
		itemsIds: (state, { navigation }) => navigation.itemsIds,
	},
	mutations: {
		updateNavigationHeight: (state, value) => {
			state.navigationHeight = value;
		},
	},
};
