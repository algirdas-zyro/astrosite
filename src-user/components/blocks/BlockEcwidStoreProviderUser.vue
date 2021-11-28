<template>
	<BlockEcwidStore
		:store-id="storeId"
		:block-id="blockId"
		:show-store="showStore"
		:is-store-loading="isStoreLoading"
		:loading-text="loadingText"
	/>
</template>

<script>
import BlockEcwidStore from '@site-modules/components/blocks/ecwid/BlockEcwidStore.vue';
import { useBlockEcwidStore } from '@site-modules/components/blocks/ecwid/useBlockEcwidStore';

export default {
	components: {
		BlockEcwidStore,
	},
	props: {
		blockId: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			default: () => ({}),
		},
	},
	setup(props) {
		const {
			storeId,
			showStore,
			isStoreLoading,
			loadingText,
		} = useBlockEcwidStore(props);

		return {
			storeId,
			showStore,
			isStoreLoading,
			loadingText,
		};
	},
};
</script>
