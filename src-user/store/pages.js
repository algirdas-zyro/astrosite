const filterObject = (objectToFilter, filterFunction) => Object.fromEntries(
	Object.entries(objectToFilter).filter(
		([key, value], index, array) => filterFunction({
			key,
			value,
			index,
			array,
		}),
	),
);

export default {
	namespaced: true,
	getters: {
		defaultPages: (state, getters, rootState) => filterObject(rootState.website.pages, ({ value }) => value.type === 'default'),
		blogPages: (state, getters, rootState) => filterObject(rootState.website.pages, ({ value }) => value.type === 'blog'),
		ecommercePages: (state, getters, rootState) => {
			const {
				pages,
				blocks,
			} = rootState.website;

			return filterObject(pages, ({ value }) => value.blocks.some((key) => blocks[key].type === 'BlockEcwidStore'));
		},
		isHomepageWithEcwid: (state, getters, rootState) => {
			const {
				meta,
				pages,
				blocks,
			} = rootState.website;

			return pages[meta.homePageId].blocks.some((key) => blocks[key].type === 'BlockEcwidStore');
		},
		publishedBlogPages: (state, getters) => filterObject(
			getters.blogPages,
			({ value }) => !value.customData.hidden,
		),
	},
};
