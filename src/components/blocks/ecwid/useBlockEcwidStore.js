import {
	getCurrentInstance,
	ref,
	computed,
	watch,
	onMounted,
	onBeforeUnmount,
} from 'vue-demi';

import ecwidDeliveryFilter from '../../../components/blocks/ecwid/ecwidDeliveryFilter';
import ecwidScript, { ECWID_LOADED_EVENT } from '../../../components/blocks/ecwid/ecwidScript';
import { isAppPrerendering } from '../../../utils/isAppPrerendering';

const DEFAULT_STORE_ID = '26103239';
const ANIMATION_TIME = 400;
const ECWID_INIT_DELAY = 1500;

export const useBlockEcwidStore = (props) => {
	const showStore = ref(true);
	const isStoreLoading = ref(false);
	const watchForEcwidCheckout = ref(null);

	const {
		state,
		getters,
	} = getCurrentInstance()?.proxy.$store;
	const websiteData = computed(() => state.website);
	const websiteDataMeta = computed(() => getters.siteMeta);
	const isMobileView = computed(() => state.gui.isMobileView);
	const loadingText = computed(() => props.data.settings.loadingText || 'Store is loading');
	const storeId = computed(() => {
		const {
			ecwidStoreId,
			demoEcwidStoreId,
		} = websiteDataMeta.value;

		return ecwidStoreId || demoEcwidStoreId || DEFAULT_STORE_ID;
	});

	const loadStore = () => {
		ecwidScript.load(storeId.value);
	};

	const startLoadingEcwidScript = () => {
		isStoreLoading.value = true;
		window.addEventListener(ECWID_LOADED_EVENT, () => {
			isStoreLoading.value = false;
		});

		if (isAppPrerendering) {
			return;
		}

		if (websiteDataMeta.value.delayEcwidInit) {
			// delayEcwidInit - delays ecwid load, for initial website load speed boost, but prolongs actual ecwid load
			// Use ONLY when initial website load measurements are priority over actual UX (ex. marketing sites)
			setTimeout(loadStore, ECWID_INIT_DELAY);
		} else {
			loadStore();
		}
	};

	const watchWhenEcwidOpensCheckout = () => {
		watchForEcwidCheckout.value = ecwidDeliveryFilter.watchForDeliveryOptions(100);
	};

	onMounted(() => {
		startLoadingEcwidScript();
		watchWhenEcwidOpensCheckout();
	});

	onBeforeUnmount(() => {
		clearTimeout(watchForEcwidCheckout.value);
	});

	watch(isMobileView, () => {
		showStore.value = false;

		setTimeout(() => {
			showStore.value = true;
			loadStore();
		}, ANIMATION_TIME);
	});

	watch(storeId, async (newStoreId) => {
		if (websiteData.value.meta.demoEcwidStoreId === newStoreId) {
			return;
		}

		// Delete previous store
		document.querySelector(`#my-store-${storeId.value}`).innerHTML = '';
		// Wait until template id changes
		await getCurrentInstance()?.proxy.$nextTick();
		startLoadingEcwidScript();
	});

	return {
		storeId,
		showStore,
		isStoreLoading,
		loadingText,
		ECWID_LOADED_EVENT,
	};
};
