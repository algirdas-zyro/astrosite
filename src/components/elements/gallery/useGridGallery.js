import { computed } from 'vue-demi';

export const useGridGallery = (props) => {
	const gridImages = computed(() => props.data.images.map((image) => ({
		src: image,
	})));
	const hasGridImages = computed(() => props.data.images.length > 0);
	const columnCount = computed(() => Number.parseInt(props.data.settings.styles['column-count'], 10));
	const columnGap = computed(() => Number.parseInt(props.data.settings.styles['column-gap'], 10));
	const isMasonryLayout = computed(() => props.data.settings.layout === 'masonry');

	return {
		hasGridImages,
		gridImages,
		columnCount,
		columnGap,
		isMasonryLayout,
	};
};
