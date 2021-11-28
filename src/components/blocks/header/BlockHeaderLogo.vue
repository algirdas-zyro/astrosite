<template>
	<div
		class="block-header-logo"
		:style="computedStyles"
	>
		<img
			v-qa="'builder-siteheader-img-logo'"
			class="block-header-logo__image"
			:src="optimizedUrl"
			alt="Logo"
			@load="handleLogoImageLoad"
		>
	</div>
</template>

<script>
import { getOptimizedSrc } from '../../../utils/getSrcsets';

export default {
	name: 'BlockHeaderLogo',
	props: {
		url: {
			type: String,
			default: null,
		},
		// CSS Properties
		height: {
			type: String,
			default: null,
		},
		heightMobile: {
			type: String,
			default: null,
		},
		maxWidth: {
			type: String,
			default: null,
		},
		maxWidthMobile: {
			type: String,
			default: null,
		},
		objectPosition: {
			type: String,
			default: null,
		},
		objectPositionMobile: {
			type: String,
			default: null,
		},
		// Optimising logo is an expensive operation when doing reactive actions, so a flag is present to control it
		isOptimized: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			optimizedHeight: null,
			optimizedHeightMobile: null,
		};
	},
	computed: {
		baseComputedStyles() {
			return {
				'--height': `${this.height}px`,
				'--m-height': `${this.heightMobile}px`,
				'--width': this.maxWidth,
				'--m-width': this.maxWidthMobile,
				'--object-position': this.objectPosition,
				'--m-object-position': this.objectPositionMobile,
			};
		},
		optimizedComputedStyles() {
			return !this.optimizedHeight || !this.optimizedHeightMobile ? {
				...this.baseComputedStyles,
			} : {
				...this.baseComputedStyles,
				'--height': `${this.optimizedHeight}px`,
				'--m-height': `${this.optimizedHeightMobile}px`,
			};
		},
		computedStyles() {
			return this.isOptimized ? this.optimizedComputedStyles : this.baseComputedStyles;
		},

		optimizedUrl() {
			if (!this.isOptimized) {
				return this.url;
			}

			const logoWidth = Number.parseInt(this.maxWidth, 10);

			return getOptimizedSrc(this.url, {
				width: (window?.devicePixelRatio ?? 1) * logoWidth,
			});
		},
	},
	methods: {
		handleLogoImageLoad(event) {
			if (!this.isOptimized) {
				return;
			}

			const logoWidth = Number.parseInt(this.maxWidth, 10);
			const logoWidthMobile = Number.parseInt(this.maxWidthMobile, 10) || logoWidth;
			const ratio = event.target.naturalWidth / event.target.naturalHeight;

			this.optimizedHeight = logoWidth / ratio;
			this.optimizedHeightMobile = logoWidthMobile / ratio;
		},
	},
};
</script>

<style lang="scss" scoped>
.block-header-logo {
	width: 100%;
	max-width: var(--width);
	height: var(--height, 100%);
	cursor: pointer;

	&__image {
		width: 100%;
		height: 100%;
		vertical-align: middle;
		object-fit: contain;
		object-position: var(--object-position);
	}
}

@include zyro-media($media-grid) {
	.block-header-logo {
		max-width: var(--m-width, var(--width));
		height: var(--m-height, 100%);

		&__image {
			object-position: var(--m-object-position);
		}
	}
}
</style>
