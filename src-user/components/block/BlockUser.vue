<template>
	<section
		class="block"
		:class="`block--${blockModifier}`"
		:style="computedStyles"
	>
		<BlockBackground
			:background="data.background"
			:is-fixed="isBackgroundFixed"
			:is-mobile-full-screen="isMobileFullScreen"
			is-lazy
		/>
		<Component
			:is="data.type"
			:block-id="id"
			:data="data"
			:is-mobile-view="isMobileView"
			:is-header-sticky="data.settings.isSticky"
			v-bind="{
				...$attrs,
				...$props
			}"
			:components="components"
			:blocks="blocks"
			:is-block-preview-mode="isBlockPreviewMode"
			v-on="$listeners"
			@hook:mounted="$emit('child-component-mounted')"
		/>
	</section>
</template>

<script>
import { computed } from 'vue-demi';

import BlockBackground from '@site-modules/components/blocks/BlockBackground.vue';
import BlockBlogHeader from '@site-modules/components/blocks/blog/BlockBlogHeader.vue';
import { BLOCK_MODIFIERS_MAP } from '@site-modules/constants';
import BlockGrid from '@user/components/block-grid/BlockGridUser.vue';
import BlockBlogList from '@user/components/blocks/BlockBlogListProviderUser.vue';
import BlockEcwidStore from '@user/components/blocks/BlockEcwidStoreProviderUser.vue';
import BlockSlideshow from '@user/components/blocks/BlockSlideshowProviderUser.vue';

import { objectToCSSVariables } from '@/use/useSiteStyles';
import { getMapValue } from '@/utils/object';
import { parseCSSSides } from '@/utils/parseCSSSides';

const MOBILE_FULL_HEIGT_THRESHOLD = 360;

export default {
	name: 'BlockUser',
	components: {
		BlockGrid,
		BlockBackground,
		BlockBlogList,
		BlockBlogHeader,
		BlockEcwidStore,
		BlockSlideshow,
	},
	inheritAttrs: false,
	props: {
		id: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
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
		blocks: {
			type: Object,
			default: () => ({}),
		},
		// In AddBlockModal.vue, components are not aware of the context where they are at.
		// For example, BlockBlogList.vue shows mock posts if there are none to show in preview.
		// But it does not know when it should show mock posts - so a flag which tells in what context it is rendered is needed.
		// This is short term until we think of a better architecture for such cases.
		isBlockPreviewMode: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const computedStyles = objectToCSSVariables(props.data?.settings?.styles);
		const isBackgroundFixed = computed(() => props.data.settings.styles.attachment === 'fixed');
		const isMobileFullScreen = computed(() => {
			if (!props.data.settings.styles['m-block-padding']) {
				return false;
			}

			/**
			 * This is an assumption that if user sets large paddings on mobile,
			 * he might want to have either full screen or height background.
			 */
			const {
				top,
				bottom,
			} = parseCSSSides(props.data.settings.styles['m-block-padding']);
			const mobilePadding = Number.parseInt(top, 10) + Number.parseInt(bottom, 10);

			return mobilePadding > MOBILE_FULL_HEIGT_THRESHOLD;
		});
		const blockModifier = computed(() => getMapValue(props.data.type, BLOCK_MODIFIERS_MAP));

		return {
			blockModifier,
			isBackgroundFixed,
			isMobileFullScreen,
			computedStyles,
		};
	},
};
</script>

<style lang="scss" scoped>
@import 'Block.scss';
</style>
