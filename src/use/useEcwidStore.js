import {
	ref,
	computed,
} from 'vue-demi';

const ecwidCartItems = ref([]);

export const useEcwidStore = () => {
	const ecwidCartItemCount = computed(() => ecwidCartItems.value.reduce((itemSum, item) => itemSum + item.quantity, 0));

	const openEcwidHomepage = () => {
		const entryPage = window.Ecwid.Controller.getEntryPage();

		window.Ecwid.openPage(entryPage.type.toLowerCase(), {
			id: entryPage.categoryId,
		});
	};

	const openCart = () => {
		if (window.Ecwid) {
			window.Ecwid.openPage('cart');
		}
	};

	const setEcwidCartItems = (items) => {
		ecwidCartItems.value = items;
	};

	return {
		ecwidCartItems: computed(() => ecwidCartItems.value),
		ecwidCartItemCount,
		openCart,
		setEcwidCartItems,
		openEcwidHomepage,
	};
};
