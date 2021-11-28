<template>
	<GridImage
		:key="src"
		:alt="alt"
		:href="href"
		:sizes="sizes"
		:src="src"
		:srcset="srcset"
		:tag-name="tagName"
		:target="target"
		:rel="rel"
		:is-lightbox-enabled="isLightboxEnabled"
		is-lazy
		:height="elementHeight"
		:width="elementWidth"
		@image-click="handleImageClick"
	/>
</template>

<script>

import { computed } from 'vue-demi';

import GridImage from '@site-modules/components/elements/image/GridImage.vue';
import {
	ANCHOR_TAG,
	IMAGE_CLICK_ACTION_NONE,
	IMAGE_CLICK_ACTION_LINK,
	IMAGE_CLICK_ACTION_LIGHTBOX,
	DIV_TAG,
} from '@site-modules/constants';
import { useLink } from '@site-modules/use/useLink';
import {
	getOptimizedSrc,
	getGridItemSrcset,
	getGridItemSizes,
	getFullWidthSrcset,
} from '@site-modules/utils/getSrcsets';

import { useLightbox } from '@/components/reusable-components/lightbox/useLightbox';
import { parseCSSSides } from '@/utils/parseCSSSides';

export default {
	name: 'GridImageProviderUser',
	components: {
		GridImage,
	},
	props: {
		data: {
			type: Object,
			required: true,
		},
		isMobileView: {
			type: Boolean,
			required: true,
		},
		mobileBlockPadding: {
			type: String,
			required: true,
		},
		elementWidth: {
			type: Number,
			default: null,
		},
		elementHeight: {
			type: Number,
			default: null,
		},
	},
	setup(props) {
		const { linkClickHandler } = useLink();

		const { addImagesToLightbox } = useLightbox();
		const imageAction = computed(() => props.data.settings.clickAction ?? IMAGE_CLICK_ACTION_NONE);
		const isLightboxEnabled = computed(() => imageAction.value === IMAGE_CLICK_ACTION_LIGHTBOX);
		const isLinkActionEnabled = computed(() => imageAction.value === IMAGE_CLICK_ACTION_LINK);
		const tagName = computed(() => (isLinkActionEnabled.value ? ANCHOR_TAG : DIV_TAG));

		// Open link in new tab if it is preview mode and the link is external
		const src = computed(() => getOptimizedSrc(props.data.settings.image, {
			width: props.elementWidth,
			height: props.elementHeight,
			shouldContain: props.data.settings.styles['object-fit'] === 'contain',
		}));

		const srcset = computed(() => getGridItemSrcset(props.data.settings.image, {
			width: props.elementWidth,
			height: props.elementHeight,
			shouldContain: props.data.settings.styles['object-fit'] === 'contain',
		}));

		const sizes = computed(() => {
			const { right } = parseCSSSides(props.mobileBlockPadding ?? '');
			const mobilePadding = right ? Number.parseInt(right, 10) : null;

			return getGridItemSizes(props.elementWidth, mobilePadding);
		});

		const handleImageClick = (event) => {
			if (isLightboxEnabled.value) {
				addImagesToLightbox({
					src: getOptimizedSrc(props.data.settings.image),
					srcset: getFullWidthSrcset(props.data.settings.image),
					alt: props.data.settings.alt,
				});
			} else {
				linkClickHandler(event);
			}
		};

		return {
			alt: computed(() => props.data.settings.alt),
			handleImageClick,
			href: computed(() => props.data.settings.href),
			src,
			srcset,
			sizes,
			tagName,
			target: computed(() => props.data.settings.target),
			rel: computed(() => props.data.settings.rel),
			isLightboxEnabled,
		};
	},
};
</script>
