<template>
	<div
		class="block-header-cart-wrapper"
		:style="{ cartIconSize }"
	>
		<button
			class="block-header-cart"
			title="Go to cart"
			@click="$emit('click')"
		>
			<div class="block-header-cart__icon-container">
				<svg
					width="19"
					height="24"
					viewBox="0 0 19 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="block-header-cart__icon"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M5.94636 5.35922C6.29451 3.00506 7.9363 1.39824 9.67973
						1.39824C11.4232 1.39824 13.0649 3.00506
						13.4131 5.35922H5.94636ZM4.53847 5.35922C4.90317 2.43147
						6.95866 0.000183105 9.67973 0.000183105C12.4008
						0.000183105 14.4563 2.43147 14.821 5.35922H17.2816H18.6797V6.75728V21.2039C18.6797
						22.7481 17.4278 24 15.8836
						24H3.4758C1.93155 24 0.679688 22.7481 0.679688
						21.2039V6.75728V5.35922H2.07775H4.53847ZM2.07775 6.75728H4.52596V9.08752C4.52596
						9.47359 4.83893 9.78655 5.22499 9.78655C5.61105 9.78655 5.92402 9.47359
						5.92402 9.08752V6.75728H13.5259V9.08752C13.5259 9.47359
						13.8389 9.78655 14.2249 9.78655C14.611 9.78655 14.9239
						9.47359 14.9239 9.08752V6.75728H17.2816V21.2039C17.2816 21.976 16.6557 22.6019
						15.8836 22.6019H3.4758C2.70368 22.6019 2.07775 21.976 2.07775 21.2039V6.75728Z"
						fill="currentColor"
					/>
				</svg>
				<span>{{ cartText }} ({{ itemsInCart }})</span>
			</div>
		</button>
	</div>
</template>

<script>
export default {
	name: 'BlockHeaderCart',
	props: {
		cartIconSize: {
			type: String,
			required: true,
		},
		cartText: {
			type: String,
			required: true,
		},
		itemsInCart: {
			type: Number,
			required: true,
		},
	},
};
</script>

<style lang="scss">
@import '../../../assets/scss/abstracts';
@include font-style('nav-link', '.block-header-cart');

.block-header-cart {
	position: relative;
	align-self: center;
	margin: 0 0 0 var(--menu-item-spacing);
	color: var(--nav-link-color);
	text-decoration: none;
	white-space: pre-wrap;
	cursor: pointer;
	background: transparent;

	&__icon-container {
		$icon-container: &;

		display: flex;
		align-items: center;
		color: var(--nav-link-color);
		cursor: pointer;
		border: 1px solid transparent;
		border-radius: 3px;
		transition: border 0.3s;

		&:focus-visible {
			border-color: var(--nav-link-color-hover, var(--nav-link-color));
		}
	}

	&__icon {
		width: var(--cartIconSize);
		height: var(--cartIconSize);
		margin-right: 6px;
	}

	&:hover,
	&:focus-visible {
		color: var(--nav-link-color-hover, var(--nav-link-color));
		text-decoration: underline;
		text-underline-offset: 7px;

		.block-header-cart__icon-container {
			color: var(--nav-link-color-hover, var(--nav-link-color));
		}
	}
}

.block-header-cart-wrapper {
	display: flex;
	align-items: center;
	text-align: left;
}

@include zyro-media($media-grid) {
	.block-header-cart {
		margin: 0;
	}
}
</style>
