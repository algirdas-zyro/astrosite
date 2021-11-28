<template>
	<div
		class="background"
		:style="computedStyles"
		:class="{ 'background--with-image': backgroundImage }"
	/>
</template>

<script>
import { getOptimizedSrc } from '../../../utils/getSrcsets';

export const FULL_WIDTH = 1920; // assume that largest screen is 1920

export default {
	name: 'BlockHeaderBackground',
	props: {
		currentOption: {
			type: String,
			default: 'color',
		},
		imageUrl: {
			type: String,
			default: '',
		},
		color: {
			type: String,
			default: '',
		},
		isTransparent: {
			type: Boolean,
			default: false,
		},
		overlayOpacity: {
			type: String,
			default: '0',
		},
	},
	computed: {
		backgroundImage() {
			return this.currentOption === 'image' && this.imageUrl;
		},
		backgroundColor() {
			return this.currentOption === 'color' ? this.color : 'transparent';
		},
		computedStyles() {
			return {
				'--background-color': this.isTransparent ? 'transparent' : this.backgroundColor,
				'--m-background-color': this.backgroundColor,
				'--background-image': `url(${this.src})`,
				'--background-image-opacity': this.overlayOpacity,
			};
		},
		src() {
			return this.backgroundImage && getOptimizedSrc(this.backgroundImage, {
				width: FULL_WIDTH,
				preload: false,
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
	background-color: var(--background-color);
	transition: background-color 0.3s ease-in-out;

	&--with-image {
		background-image: var(--background-image);

		&::before {
			position: absolute;
			top: 0;
			left: 0;
			display: block;
			width: 100%;
			height: 100%;
			content: ' ';
			background-color: #000;
			opacity: var(--background-image-opacity);
		}
	}
}

@include zyro-media($media-grid) {
	.background {
		background-color: var(--m-background-color);
	}
}
</style>
