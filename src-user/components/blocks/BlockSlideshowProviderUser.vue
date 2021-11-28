<template>
	<BlockSlideshow
		ref="slideshowRef"
		class="block-slideshow"
		:slides="slides"
		:current-slide-index="currentSlideIndex"
		:current-sliding-direction="currentSlidingDirection"
		:slideshow-settings="slideshowSettings"
		:is-previous-slide-navigation-visible="isPreviousSlideNavigationVisible"
		:is-next-slide-navigation-visible="isNextSlideNavigationVisible"
		:slides-count="slidesCount"
		@previous-slide:click="handlePreviousSlideClick"
		@next-slide:click="handleNextSlideClick"
		@indicator:click="handleDotSlideClick"
		@transition-start="setIsSlideTransitioning(true)"
		@transition-end="setIsSlideTransitioning(false)"
	>
		<template slot-scope="{ slide }">
			<BlockGridUser
				:block-id="slide.blockId"
				:class="{ 'block-grid--mobile-full-height': slideshowSettings.isMobileFullScreenHeightEnabled }"
				:data="slide.data"
				:is-mobile-view="isMobileView"
				:components="components"
			/>
		</template>
	</BlockSlideshow>
</template>
<script>
import {
	onBeforeUnmount,
	onMounted,
	ref,
} from 'vue-demi';

import BlockSlideshow from '@site-modules/components/blocks/slideshow/BlockSlideshow.vue';
import {
	DIRECTION_LEFT,
	useBlockSlideshow,
} from '@site-modules/components/blocks/slideshow/useBlockSlideshow';
import BlockGridUser from '@user/components/block-grid/BlockGridUser.vue';

import { moveDirection } from '@/utils/moveDirection';

export default {
	components: {
		BlockSlideshow,
		BlockGridUser,
	},
	props: {
		blocks: {
			type: Object,
			required: true,
		},
		components: {
			type: Object,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
		blockId: {
			type: String,
			required: true,
		},
		isMobileView: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const {
			slides,
			currentSlidingDirection,
			slideshowSettings,
			slidesCount,
			currentSlideIndex,
			isPreviousSlideNavigationVisible,
			isNextSlideNavigationVisible,
			goToNextSlide,
			goToPreviousSlide,
			goToSlide,
			setSlidingDirection,
			setIsSlideTransitioning,
			slideshowRef,
		} = useBlockSlideshow(props);
		const autoPlayInterval = ref(null);

		const autoplaySlides = () => setInterval(() => {
			const isLoopDisabledAndReachedLastSlide = !slideshowSettings.value.isLoopEnabled
				&& (currentSlideIndex.value === slidesCount.value - 1);

			if (isLoopDisabledAndReachedLastSlide) {
				clearInterval(autoPlayInterval.value);

				return;
			}

			goToNextSlide();
		}, slideshowSettings.value.autoplaySlidesIntervalSeconds * 1000);

		const resetAutoplayInterval = () => {
			clearInterval(autoPlayInterval.value);
			if (slideshowSettings.value.isAutoplayEnabled) {
				autoPlayInterval.value = autoplaySlides();
			}
		};

		const handlePreviousSlideClick = () => {
			goToPreviousSlide();
			resetAutoplayInterval();
		};

		const handleNextSlideClick = () => {
			goToNextSlide();
			resetAutoplayInterval();
		};

		const handleDotSlideClick = (index) => {
			goToSlide(index);
			resetAutoplayInterval();
		};

		const { enableMoveEvents } = moveDirection({
			move: {
				drag: false,
				swipe: true,
			},
			onMoveLeft: goToNextSlide,
			onMoveRight: goToPreviousSlide,
		});

		onMounted(() => {
			if (slideshowSettings.value.isAutoplayEnabled) {
				autoPlayInterval.value = autoplaySlides();
			}

			setSlidingDirection(DIRECTION_LEFT);
			setIsSlideTransitioning(false);
			enableMoveEvents(true, slideshowRef.value.$el);
		});

		onBeforeUnmount(() => {
			clearInterval(autoPlayInterval.value);
			enableMoveEvents(false, slideshowRef.value.$el);
		});

		return {
			slides,
			currentSlidingDirection,
			slideshowSettings,
			slidesCount,
			currentSlideIndex,
			isPreviousSlideNavigationVisible,
			isNextSlideNavigationVisible,
			goToNextSlide,
			goToPreviousSlide,
			goToSlide,
			setSlidingDirection,
			setIsSlideTransitioning,
			slideshowRef,
			handlePreviousSlideClick,
			handleNextSlideClick,
			handleDotSlideClick,
		};
	},
};
</script>
