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
			'image--link': tagName === 'a',
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
			default: true,
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
			validator: (tag) => ['a', 'div'].includes(tag),
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
};
</script>

<style lang="scss">
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

@media screen and (max-width: 920px) {
	.image__image--reset-m-position {
		position: static;
		height: auto;
	}
}
</style>
