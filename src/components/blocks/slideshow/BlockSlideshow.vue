<template>
	<div class="slideshow">
		<div class="slideshow__slides">
			<BlockSlideshowSlide
				v-for="(slide, index) in slides"
				:key="slide.blockId"
				:is-active="currentSlideIndex === index"
				:sliding-direction="currentSlidingDirection"
				@transition-start="$emit('transition-start')"
				@transition-end="$emit('transition-end')"
			>
				<BlockBackground
					:background="slide.data.background"
					:is-fixed="slide.data.settings.styles.attachment === 'fixed'"
					:is-mobile-full-screen="slideshowSettings.isMobileFullScreenHeightEnabled"
					preload
					is-lazy
				/>
				<slot :slide="slide" />
			</BlockSlideshowSlide>
		</div>
		<template v-if="slideshowSettings.isNavigationArrowsVisible">
			<BlockSlideshowNavButton
				v-if="isPreviousSlideNavigationVisible"
				class="slideshow__nav-button slideshow__nav-button--left"
				:class="{ 'slideshow__nav-button--is-click-disabled': currentElementId }"
				@click.native="$emit('previous-slide:click')"
			/>
			<BlockSlideshowNavButton
				v-if="isNextSlideNavigationVisible"
				class="slideshow__nav-button slideshow__nav-button--right"
				:class="{ 'slideshow__nav-button--is-click-disabled': currentElementId }"
				@click.native="$emit('next-slide:click')"
			/>
		</template>
		<BlockSlideshowNavBottom
			v-if="slideshowSettings.isNavigationBulletsVisible"
			:slide-count="slidesCount"
			:active-slide-index="currentSlideIndex"
			v-on="$listeners"
		/>
	</div>
</template>
<script>
import BlockBackground from '../../../components/blocks/BlockBackground.vue';
import BlockSlideshowNavBottom from '../../../components/blocks/slideshow/BlockSlideshowNavBottom.vue';
import BlockSlideshowNavButton from '../../../components/blocks/slideshow/BlockSlideshowNavButton.vue';
import BlockSlideshowSlide from '../../../components/blocks/slideshow/BlockSlideshowSlide.vue';
import { DIRECTION_LEFT } from '../../../components/blocks/slideshow/useBlockSlideshow';

export default {
	components: {
		BlockBackground,
		BlockSlideshowNavBottom,
		BlockSlideshowNavButton,
		BlockSlideshowSlide,
	},
	props: {
		slides: {
			type: Array,
			required: true,
		},
		currentSlideIndex: {
			type: Number,
			required: true,
		},
		currentSlidingDirection: {
			type: String,
			default: DIRECTION_LEFT,
		},
		slideshowSettings: {
			type: Object,
			required: true,
		},
		isPreviousSlideNavigationVisible: {
			type: Boolean,
			required: true,
		},
		isNextSlideNavigationVisible: {
			type: Boolean,
			required: true,
		},
		slidesCount: {
			type: Number,
			required: true,
		},
		currentElementId: {
			type: String,
			default: null,
		},
	},
};
</script>

<style lang="scss">
@import '../../../assets/scss/abstracts';
@import '../../../components/blocks/slideshow/BlockSlideshow.scss';

.slideshow {
	z-index: 13;

	&__nav-button {
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: $z-index-controls--slideshow;
		padding: 12px 58px;
		cursor: pointer;
		background: transparent;

		&:hover,
		&:focus-visible {
			opacity: 0.6;
		}

		&--left {
			left: 0;
			transform: rotate(180deg);
		}

		&--right {
			right: 0;
		}

		&--is-click-disabled {
			pointer-events: none;
		}
	}
}

@include zyro-media($media-grid) {
	.slideshow {
		&__nav-button {
			padding: 12px 28px;
		}
	}
}

</style>
