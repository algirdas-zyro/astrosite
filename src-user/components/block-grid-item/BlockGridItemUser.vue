// TODO: Document innerBackgroundValue
<template>
	<div
		v-if="!hidden"
		class="block-grid-item use-m-margin"
		:style="computedStyles"
		:data-qa="`${data.type && data.type.toLowerCase()}:${id && id.toLowerCase()}`"
	>
		<Component
			:is="data.type"
			:id="id"
			class="block-grid-item__component"
			:data="data"
			:is-mobile-view="isMobileView"
			:mobile-block-padding="mobileBlockPadding"
			:element-width="elementWidth"
			:element-height="elementHeight"
		/>
	</div>
</template>

<script>
import { mapState } from 'vuex';

import { getGridItemSize } from '@site-modules/utils/getGridItemSize';
import GridButtonProviderUser from '@user/components/elements/GridButtonProviderUser.vue';
import GridEcommerceButtonProviderUser from '@user/components/elements/GridEcommerceButtonProviderUser.vue';
import GridEmbedProviderUser from '@user/components/elements/GridEmbedProviderUser.vue';
import GridFormProviderUser from '@user/components/elements/GridFormProviderUser.vue';
import GridGalleryProviderUser from '@user/components/elements/GridGalleryProviderUser.vue';
import GridImageProviderUser from '@user/components/elements/GridImageProviderUser.vue';
import GridInstagramFeedProviderUser from '@user/components/elements/GridInstagramFeedProviderUser.vue';
import GridMapProviderUser from '@user/components/elements/GridMapProviderUser.vue';
import GridSocialIconsProviderUser from '@user/components/elements/GridSocialIconsProviderUser.vue';
import GridStripeButtonProviderUser from '@user/components/elements/GridStripeButtonProviderUser.vue';
import GridTextBoxProviderUser from '@user/components/elements/GridTextBoxProviderUser.vue';
import GridVideoProviderUser from '@user/components/elements/GridVideoProviderUser.vue';

import { objectToCSSVariables } from '@/use/useSiteStyles';

export default {
	name: 'BlockGridItemUser',
	components: {
		GridButton: GridButtonProviderUser,
		GridStripeButton: GridStripeButtonProviderUser,
		GridEcommerceButton: GridEcommerceButtonProviderUser,
		GridForm: GridFormProviderUser,
		GridVideo: GridVideoProviderUser,
		GridTextBox: GridTextBoxProviderUser,
		GridMap: GridMapProviderUser,
		GridSocialIcons: GridSocialIconsProviderUser,
		GridGallery: GridGalleryProviderUser,
		GridImage: GridImageProviderUser,
		GridInstagramFeed: GridInstagramFeedProviderUser,
		GridEmbed: GridEmbedProviderUser,
	},
	props: {
		id: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
		mobileBlockPadding: {
			type: String,
			required: true,
		},
		isMobileView: {
			type: Boolean,
			default: false,
		},
		blockData: {
			type: Object,
			required: true,
		},
	},
	computed: {
		...mapState('gui', ['isMobileScreen']),
		settings() {
			return this.data.settings;
		},
		styles() {
			return this.settings.styles;
		},
		innerBackgroundValue({ data }) {
			const { innerBackground } = data;

			if (!innerBackground) {
				return {};
			}

			const currentBackground = innerBackground[innerBackground.current];

			if (innerBackground.current === 'image') {
				const imageBackground = {
					'--gridItemInnerBackground': `url(${currentBackground})`,
				};

				if ('overlay-opacity' in innerBackground) {
					imageBackground['--gridItemInnerBackgroundOverlayOpacity'] = innerBackground['overlay-opacity'];
				}

				return imageBackground;
			}

			return {
				'--gridItemInnerBackground': currentBackground,
			};
		},
		elementWidth() {
			return getGridItemSize(this.blockData, this.styles.position)?.width;
		},
		elementHeight() {
			return getGridItemSize(this.blockData, this.styles.position)?.height;
		},
		computedStyles() {
			return {
				...objectToCSSVariables(this.styles),
				...this.innerBackgroundValue,
			};
		},
		hidden() {
			return this.isMobileScreen && this.settings.hiddenOn === 'mobile';
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'BlockGridItem.scss';

.block-grid-item {
	/**
			Make only the actual component clickable,
			prevents for example buttons that are over
			textboxes from being non clickable
		*/
	pointer-events: none;

	&__component {
		pointer-events: all;
	}
}

@include zyro-media($media-grid) {
	.block-grid-item {
		// TODO: Move to mapper
		width: var(--m-width, 100%);

		&.use-m-margin {
			margin: var(--m-element-margin);

			&:last-of-type {
				margin-bottom: 0;
			}
		}
	}
}
</style>
