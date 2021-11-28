<template>
	<div class="block-grid">
		<BlockGridItemUser
			v-for="elementId in data.components"
			:id="elementId"
			:key="elementId"
			:data="components[elementId] || website.components[elementId]"
			class="grid__item"
			:class="{ 'block-grid--overflow-visible': getIsOverflowVisible(elementId) }"
			:style="{ '--element-z-index': data.zindexes.indexOf(elementId) + 1 }"
			:is-mobile-view="isMobileView"
			:mobile-block-padding="data.settings.styles['m-block-padding']"
			:block-data="data"
		/>
	</div>
</template>

<script>
import { mapState } from 'vuex';

import BlockGridItemUser from '@user/components/block-grid-item/BlockGridItemUser.vue';

export default {
	components: {
		BlockGridItemUser,
	},
	props: {
		data: {
			type: Object,
			required: true,
		},
		blockId: {
			type: String,
			required: true,
		},
		components: {
			type: Object,
			default: () => ({}),
		},
		isMobileView: {
			type: Boolean,
			default: false,
		},
	},
	computed: mapState(['website']),
	methods: {
		getIsOverflowVisible(elementId) {
			return this.components[elementId]?.type === 'GridForm';
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'BlockGrid.scss';

// for users don't overflow content if row height is too small and text wraps
.block-grid {
	grid-template-rows: repeat(var(--rows), minmax(var(--row-size), auto));

	&--overflow-visible {
		overflow: visible;
	}
}
</style>
