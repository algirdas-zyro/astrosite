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
			:src="src"
			:srcset="srcset"
			:sizes="sizes"
			:height="height"
			:width="width"
			:loading="isLcp? 'eager' : 'lazy'"
			:class="{
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
} from '@site-modules/constants';

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
		isLcp: {
			type: Boolean,
			default: false,
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

@include site-engine-mobile {
	.image__image--reset-m-position {
		position: static;
		height: auto;
	}
}
</style>
