<template>
	<Component
		:is="tagName"
		:href="href"
		:target="target"
		:rel="rel"
		:title="alt"
		:class="{
			'image': !isUnstyled,
			'image--unstyled': isUnstyled,
			'image--link': tagName === ANCHOR_TAG,
		}"
		@click="$emit('image-click', $event)"
	>
		<img
			data-qa="builder-gridelement-image"
			:alt="alt"
			:src="isLazy ? placeholderSrc : src"
			:data-src="isLazy && src"
			:data-srcset="isLazy && srcset"
			:data-sizes="isLazy && sizes"
			:height="height"
			:width="width"
			:class="{
				'lazyload': isLazy,
				'image__image--zoom': isLightboxEnabled,
				'image__image--unstyled': isUnstyled,
				'image__image': !isUnstyled,
				'image__image--reset-m-position': resetMobilePosition
			}"
			v-on="{
				drag: preventDrag ? (e) => e.preventDefault() : () => null,
				dragstart: preventDrag ? (e) => e.preventDefault() : () => null,
			}"
		>
		<slot />
	</Component>
</template>

<script>
import {
	ANCHOR_TAG,
	DIV_TAG,
} from '../../../constants';

const ALLOWED_TAG_NAMES = [
	DIV_TAG,
	ANCHOR_TAG,
];

export default {
	props: {
		alt: {
			type: String,
			default: null,
		},
		href: {
			type: String,
			default: null,
		},
		preventDrag: {
			type: Boolean,
			default: false,
		},
		sizes: {
			type: String,
			default: null,
		},
		src: {
			type: String,
			required: true,
		},
		srcset: {
			type: String,
			default: null,
		},
		tagName: {
			type: String,
			validator: (tag) => ALLOWED_TAG_NAMES.includes(tag),
			default: 'div',
		},
		target: {
			type: String,
			default: null,
		},
		rel: {
			type: String,
			default: null,
		},
		isLazy: {
			type: Boolean,
			default: false,
		},
		isLightboxEnabled: {
			type: Boolean,
			default: false,
		},
		isUnstyled: {
			type: Boolean,
			default: false,
		},
		resetMobilePosition: {
			type: Boolean,
			default: true,
		},
		width: {
			type: Number,
			default: null,
		},
		height: {
			type: Number,
			default: null,
		},
	},
	setup() {
		return {
			ANCHOR_TAG,
		};
	},
	computed: {
		placeholderSrc() {
			return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${this.width} ${this.height}'%3E%3C/svg%3E`;
		},
	},
};
</script>

<style lang="scss" scoped>
.image {
	position: relative;
	display: block;
	width: 100%;
	height: 100%;

	&--unstyled {
		// Fill element with image
		display: flex;
	}

	&--link {
		transition: filter 0.2s ease;

		&:hover {
			filter: contrast(0.8);
		}
	}

	&__image {
		// <img /> size is controlled by parent element (which is controlled by grid)
		position: absolute;
		display: block;
		object-fit: var(--object-fit, cover);
		border-radius: var(--border-radius);

		&--zoom {
			cursor: zoom-in;
		}

		// When size is not controlled by grid
		&,
		&--unstyled {
			width: 100%;
			height: 100%;
		}
	}
}

@include zyro-media($media-grid) {
	.image__image--reset-m-position {
		position: static;
		height: auto;
	}
}
</style>
