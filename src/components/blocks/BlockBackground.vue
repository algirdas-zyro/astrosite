<template>
	<div
		v-if="background"
		class="background"
		:style="computedStyles"
	>
		<div
			v-if="backgroundImage"
			class="background__image-wrapper"
			:class="{ 'background__image-wrapper--fixed': isFixed }"
		>
			<img
				:key="src"
				:alt="alt"
				:src="!isLazy && src"
				:data-src="isLazy && src"
				:data-srcset="isLazy && srcset"
				sizes="100vw"
				height="100%"
				width="100%"
				class="background__image"
				:class="{
					'background__image--fixed': isFixed,
					'lazyload': isLazy,
				}"
			>
			<div
				v-if="background['overlay-opacity']"
				class="background__overlay"
				:style="{ opacity: background['overlay-opacity'] }"
			/>
		</div>
	</div>
</template>

<script>
import {
	getOptimizedSrc,
	getFullWidthSrcset,
} from '../../../utils/getSrcsets';

export const FULL_WIDTH = 1920; // assume that largest screen is 1920

export default {
	name: 'BlockBackground',
	props: {
		alt: {
			type: String,
			default: null,
		},
		background: {
			type: Object,
			default: () => ({}),
		},
		isLazy: {
			type: Boolean,
			default: false,
		},
		isFixed: {
			type: Boolean,
			default: false,
		},
		isMobileFullScreen: {
			type: Boolean,
			default: false,
		},
		preload: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		backgroundImage() {
			return this.background.current === 'image' && this.background.image;
		},
		backgroundColor() {
			return this.background.current === 'color' ? this.background.color : 'transparent';
		},
		computedStyles() {
			return {
				'--background-color': this.backgroundColor,
				'--m-background-color': this.backgroundColor,
			};
		},
		src() {
			return this.backgroundImage && getOptimizedSrc(this.backgroundImage, {
				width: FULL_WIDTH,
				preload: this.preload,
			});
		},
		srcset() {
			return this.backgroundImage && getFullWidthSrcset(this.backgroundImage, {
				preload: this.preload,
				isMobileFullScreen: this.isMobileFullScreen,
			});
		},
	},
};
</script>

<style lang="scss">
.background {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: z-index(user--block-background);
	display: block;
	clip: rect(0, auto, auto, 0);
	background-color: var(--background-color);
	transition: background-color 0.3s ease-in-out;

	&__image {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		display: block;
		object-fit: cover;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;

		&--fixed {
			position: fixed;
		}
	}

	&__image-wrapper {
		transition: opacity 0.3s ease-in-out;

		&--is-hidden {
			opacity: 0;
		}

		&--fixed {
			position: relative;
			z-index: -1;
			width: 100%;
			height: 100%;
			overflow: hidden;
		}
	}

	&__overlay {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		width: 100%;
		height: 100%;
		background-color: #000;
	}
}

@include zyro-media($media-grid) {
	.background {
		background-color: var(--m-background-color);

		&__image-wrapper {
			opacity: 1;
		}
	}
}
</style>
