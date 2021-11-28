<template>
	<GridGallery
		is-lazy
		:grid-images="gridImages"
		:is-lightbox-enabled="isLightboxEnabled"
		:column-count="columnCount"
		:column-gap="columnGap"
		:is-masonry-layout="isMasonryLayout"
		@image-click="handleGalleryImageClick"
	/>
</template>

<script>
import { computed } from 'vue-demi';

import GridGallery from '@site-modules/components/elements/gallery/GridGallery.vue';
import { useGridGallery } from '@site-modules/components/elements/gallery/useGridGallery';
import { GRID_BREAKPOINT } from '@site-modules/constants';
import {
	getOptimizedSrc,
	getGridGallerySrcset,
} from '@site-modules/utils/getSrcsets';

import { useLightbox } from '@/components/reusable-components/lightbox/useLightbox';
import { parseCSSSides } from '@/utils/parseCSSSides';

const IMAGE_CLICK_ACTION_LIGHTBOX = 'lightbox';

export default {
	name: 'GridGalleryProviderUser',
	components: {
		GridGallery,
	},
	props: {
		data: {
			type: Object,
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
		const {
			gridImages,
			columnCount,
			columnGap,
			isMasonryLayout,
		} = useGridGallery(props);
		const { addImagesToLightbox } = useLightbox();
		const mobilePadding = computed(() => {
			const { right } = parseCSSSides(props.mobileBlockPadding ?? '');

			return Number.parseInt(right, 10) || 0;
		});

		const imageWidth = computed(() => Math.ceil((columnGap.value + props.elementWidth) / columnCount.value) - columnGap.value);

		// Only add height (=== imageWidth) if not in masonry view
		const imageHeight = computed(() => !isMasonryLayout.value && imageWidth.value);

		const sizes = computed(() => [
			`(min-width: ${GRID_BREAKPOINT}px) ${imageWidth.value}px`,
			// Calculating exact value of gallery item in mobile is very complex, just use approximate
			`${100 / columnCount.value}vw`,
		].join(', '));

		const userGridImages = computed(() => gridImages.value.map((image) => {
			const src = computed(() => getOptimizedSrc(image.src, {
				width: imageWidth.value,
				height: imageHeight.value,
			}));

			const srcset = computed(() => getGridGallerySrcset(image.src, {
				width: imageWidth.value,
				height: imageHeight.value,
				columnCount: columnCount.value,
				columnGap: columnGap.value,
				mobilePadding: mobilePadding.value,
				isMasonryLayout: isMasonryLayout.value,
			}));

			return {
				...image,
				src: src.value,
				srcset: srcset.value,
				sizes: sizes.value,
				width: imageWidth.value,
				height: imageHeight.value,
				preventDrag: true,
			};
		}));

		const isLightboxEnabled = computed(
			() => props.data.settings.imageClickAction === IMAGE_CLICK_ACTION_LIGHTBOX,
		);

		const handleGalleryImageClick = (index) => {
			if (isLightboxEnabled.value) {
				addImagesToLightbox(gridImages.value, index);
			}
		};

		return {
			gridImages: userGridImages,
			isLightboxEnabled,
			handleGalleryImageClick,
			columnCount,
			columnGap,
			isMasonryLayout,
		};
	},
};
</script>
