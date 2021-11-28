export default {
	namespaced: true,
	getters: {
		categoryNameById: (state, getters, rootState) => (categoryId) => rootState
			.website.blogCategories[categoryId].name,
	},
};
