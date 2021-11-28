<template>
	<div class="gallery">
		<masonry
			v-if="isMasonryLayout"
			ref="masonry"
			:cols="columnCount"
			:gutter="columnGap"
		>
			<GridImage
				v-for="(image, index) in gridImages"
				:key="`${index}${image.src}`"
				class="gallery__masonry-image"
				:alt="image.alt"
				:src="image.src"
				:srcset="image.srcset"
				:sizes="image.sizes"
				:width="image.width"
				:prevent-drag="image.preventDrag"
				is-unstyled
				:is-lazy="isLazy"
				:is-lightbox-enabled="isLightboxEnabled"
				:reset-mobile-position="false"
				@image-click="$emit('image-click', index)"
			/>
		</masonry>
		<div
			v-else
			class="gallery__grid"
		>
			<div
				v-for="(image, index) in gridImages"
				:key="`${index}${image.src}`"
				class="gallery__block"
			>
				<GridImage
					:key="`${index}${image.src}`"
					:alt="image.alt"
					:src="image.src"
					:srcset="image.srcset"
					:sizes="image.sizes"
					:width="image.width"
					:height="image.height"
					:prevent-drag="image.preventDrag"
					:is-lightbox-enabled="isLightboxEnabled"
					:reset-mobile-position="false"
					:is-lazy="isLazy"
					class="gallery__image"
					@image-click="$emit('image-click', index)"
				/>
			</div>
		</div>
		<slot />
	</div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import GridImage from '../../../components/elements/image/GridImage.vue';

export default {
	name: 'GridGallery',
	components: {
		GridImage,
	},
	props: {
		columnCount: {
			type: Number,
			required: true,
		},
		columnGap: {
			type: Number,
			required: true,
		},
		gridImages: {
			type: Array,
			required: true,
		},
		isLightboxEnabled: {
			type: Boolean,
			required: false,
		},
		isMasonryLayout: {
			type: Boolean,
			default: false,
		},
		isLazy: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		/**
		 * If screen size doesn't change, masonry doesn't recalculate
		 * We could probably fork vue-masonry-css if more issues pop up
		 * its not a lot of code
		 */
		async columnCount() {
			if (this.isMasonryLayout) {
				await this.$nextTick();
				this.$refs.masonry._reCalculateColumnCount();
			}
		},
		async columnGap() {
			if (this.isMasonryLayout) {
				await this.$nextTick();
				this.$refs.masonry._reCalculateGutterSize();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.gallery {
	&__grid {
		display: grid;
		grid-template-columns: repeat(var(--column-count), 1fr);
		grid-gap: var(--column-gap);
	}

	&__masonry-image:not(:last-child) {
		/**
		* vue-masonry-css doesn't add margins to vue components, can't find why
		* adding them manually here
		*/
		margin-bottom: var(--column-gap);
	}

	&__block {
		position: relative;
		padding-top: 100%;
	}

	// After building css order changes, increase specificity to override styles in final build
	&__image:not(.s) {
		position: absolute;
		top: 0;
		left: 0;
		display: block;
		width: 100%;
		height: 100%;
	}
}
</style>
