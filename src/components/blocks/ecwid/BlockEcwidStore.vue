<template>
	<div
		:id="blockId"
		class="block-ecwid-store"
		data-qa="builder-section-onlinestore"
	>
		<div
			v-if="isStoreLoading"
			class="block-ecwid-store__loader-block"
		>
			<ZyroLoader
				class="block-ecwid-store__loader"
				:style="{
					'--size': '44px',
					'--weight': '4px',
					'--border-color': 'transparent',
					'--color': 'black'
				}"
			/>
			{{ loadingText }}
		</div>
		<!-- class binding on ref="store" div is not working properly because ecwid takes over this DOM element -->
		<!-- height: 0; is needed to hide block, but still have it's width -->
		<div :class="{ 'height-0': isStoreLoading }">
			<div
				v-if="showStore"
				:id="`my-store-${storeId}`"
				data-qa="onlinestore-section-ecwid"
			/>
		</div>
	</div>
</template>

<script>
import ZyroLoader from '../../../components/ZyroLoader.vue';

export default {
	components: {
		ZyroLoader,
	},
	props: {
		blockId: {
			type: String,
			required: true,
		},
		storeId: {
			type: String,
			required: true,
		},
		isStoreLoading: {
			type: Boolean,
			required: true,
		},
		showStore: {
			type: Boolean,
			required: true,
		},
		loadingText: {
			type: String,
			default: 'Store is loading',
		},
	},
};
</script>

<style lang="scss" scoped>
.block-ecwid-store {
	z-index: z-index(user--block-grid);
	grid-area: 1/1/-1/-1;
	width: 100%;
	max-width: calc(var(--content-width) + var(--block-padding-right) + var(--block-padding-left));
	padding: var(--block-padding);
	margin: auto;

	&__loader-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 80vh;
		padding: 150px 0;
		font-family: var(--font-primary);
		font-size: 18px;
		color: black;
		background: white;
	}

	&__loader {
		margin: 0;
		margin-bottom: 28px;
	}
}

.height-0 {
	height: 0;
	overflow: hidden;
}

@include zyro-media($media-grid) {
	.block-ecwid-store {
		padding: var(--m-block-padding);
	}
}
</style>

<style lang="scss">
// Not scoped scss to style 3rd party ecwid DOM

.ec-has-filters-popup {
	.block-ecwid-store {
		z-index: z-index(user--overlay);
	}
}

html#ecwid_html body#ecwid_body {
	.block-ecwid-store {
		.ec-store__content-wrapper {
			display: flex;
			flex-direction: column;
		}

		.footer__link--favorites {
			display: none;
		}

		.ec-footer {
			order: -1;
		}

		.ec-size .ec-store {
			a,
			div,
			span {
				font-family: var(--font-secondary);
			}

			.ec-header-h1,
			.ec-header-h2,
			.ec-header-h3,
			.ec-header-h4,
			.ec-header-h5,
			.ec-header-h6 {
				font-family: var(--font-primary);
			}
		}

		.ecwid-productBrowser {
			padding: 0;
		}
	}
}

html#ecwid_html.ec-has-filters-popup body#ecwid_body {
	overflow: auto;
}

// for ecwid checkout
.zyro-ecwid__radio-section {
	display: flex;
	flex-direction: column;

	p {
		order: 1;
	}

	.zyro-ecwid__search {
		order: 2;
	}

	.ec-radiogroup {
		order: 3;
	}

	.form-control__inline-label {
		display: flex;
		align-self: center;
	}

	.zyro-ecwid__loading {
		opacity: 0.5 !important;
	}

	.zyro-ecwid__package-icon {
		flex-shrink: 0;
		width: 18px;
		margin-left: 5px !important;
	}

	.ec-radiogroup__radio {
		justify-content: start !important;
	}
}

.zyro-ecwid__hidden {
	display: none !important;
}
</style>
