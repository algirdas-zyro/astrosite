<template>
	<li
		class="block-header-item"
		:class="{
			'block-header-item--has-desktop-dropdown': !areDropdownsHidden && isShownOnDesktop,
			'block-header-item--has-mobile-dropdown': isShownOnMobile,
		}"
		:style="computedStyles"
	>
		<BlockHeaderItemContent
			:item="item"
			class="block-header-item__item"
			:aria-haspopup="item.hasDropdown"
			:aria-expanded="isShownOnDesktop || isShownOnMobile"
			@toggle="isShownOnMobile = !isShownOnMobile, isShownOnDesktop = !isShownOnDesktop"
			@mouseover.native="isShownOnDesktop = true"
			@mouseleave.native="isShownOnDesktop = false"
			@navigation-item-click="$emit('navigation-item-click', $event)"
		/>
		<div
			v-if="!areDropdownsHidden && item.hasDropdown"
			class="block-header-item__dropdown-area"
			@mouseover="isShownOnDesktop = true"
			@mouseleave="isShownOnDesktop = false"
		>
			<ul class="block-header-item__dropdown">
				<BlockHeaderItem
					v-for="subItem in item.subItems"
					:key="subItem.id"
					:item="subItem"
					v-on="$listeners"
				/>
			</ul>
		</div>
	</li>
</template>

<script>
import BlockHeaderItemContent from '../../../components/blocks/header/BlockHeaderItemContent.vue';

export default {
	name: 'BlockHeaderItem',
	components: {
		BlockHeaderItemContent,
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
		dropdownBackgroundColor: {
			type: String,
			default: null,
		},
		areDropdownsHidden: {
			type: Boolean,
			default: false,
		},
		isDropdownTransparentMobile: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			isShownOnDesktop: false,
			isShownOnMobile: false,
		};
	},
	computed: {
		computedStyles() {
			return {
				'--dropdown-background-color': this.dropdownBackgroundColor,
				'--m-dropdown-background-color': this.isDropdownTransparentMobile ? 'transparent' : 'var(--contrastBackgroundColor)',
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.block-header-item {
	$this: &;

	user-select: none;

	&__dropdown-area {
		$side-padding: 16px;

		position: absolute;
		z-index: 1;
		display: none;
		padding-top: 24px;
		padding-right: $side-padding;
		padding-bottom: 48px;
		padding-left: $side-padding;
		margin-left: calc(var(--menu-item-spacing) - #{$side-padding});
	}

	&__dropdown {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 16px 24px;
		list-style: none;
		background-color: var(--dropdown-background-color);
		border-radius: $border-radius-small;
		box-shadow: $box-shadow;
		animation: expand 0.2s cubic-bezier(0.45, 0, 0.1, 1);

		& > #{$this}:not(:last-child) {
			margin-bottom: 8px;
		}

		::v-deep {
			.item-content {
				margin: 0;
			}
		}
	}

	&--has-desktop-dropdown {
		.block-header-item__dropdown-area {
			display: block;
		}

		::v-deep {
			.item-content__icon {
				transform: rotate(180deg);
			}
		}
	}

	&--no-margin {
		#{$this}__item {
			margin: 0;
		}
	}
}

@include zyro-media($media-grid) {
	.block-header-item {
		$this: &;

		&__dropdown-area {
			position: unset;
			padding: 8px 0;
			margin: 8px calc(-1 * var(--padding-left)) 0 calc(-1 * var(--padding-right));
			background-color: var(--m-dropdown-background-color);
		}

		&__dropdown {
			padding: 0;
			background-color: transparent;
			box-shadow: none;
		}

		&--has-desktop-dropdown {
			.block-header-item__dropdown-area {
				display: none;
			}

			::v-deep {
				.item-content__icon {
					transform: none;
				}
			}
		}

		&--has-mobile-dropdown {
			.block-header-item__dropdown-area {
				display: block;
			}

			::v-deep {
				.item-content__icon {
					transform: rotate(180deg);
				}

				.item-content__icon-container {
					border-color: var(--nav-link-color);
				}

				.item-content-wrapper {
					&--active,
					&:hover,
					&:focus {
						.item-content__icon-container {
							border-color: var(--nav-link-color-hover, var(--nav-link-color));
						}
					}
				}
			}
		}
	}
}

@keyframes expand {
	0% {
		display: none;
		opacity: 0;
	}

	1% {
		display: block;
		opacity: 0;
		transform: translate(0, -1em);
	}

	100% {
		opacity: 1;
		transform: translate(0, 1);
	}
}
</style>
