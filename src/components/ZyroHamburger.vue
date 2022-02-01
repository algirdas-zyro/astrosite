<template>
	<button
		type="button"
		class="burger"
		:class="{ 'burger--open' : isOpen }"
		:title="title"
		:style="computedStyles"
	>
		<span class="burger__bun" />
		<span class="burger__meat" />
		<span class="burger__bun" />
	</button>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: 'Menu',
		},
		isOpen: {
			type: Boolean,
			required: true,
		},
		color: {
			type: String,
			default: 'var(--nav-link-color)',
		},
	},
	computed: {
		computedStyles() {
			return {
				'--burger-color': this.color,
			};
		},
	},
};
</script>

<style lang="scss">
.burger {
	width: 24px;
	height: 18px;
	cursor: pointer;
	background-color: transparent;
	transition: all 0.4s ease-in-out 0.1s;
	transform: rotate(0deg);

	&:focus-visible {
		outline: 2px solid;
		outline-offset: 1px;
	}

	&__bun,
	&__meat {
		position: absolute;
		display: block;
		width: 100%;
		height: 2px;
		background: var(--burger-color);
		border-radius: 2px;
		transition: all 0.25s ease-in-out 0.1s;
		transform: rotate(0deg);
		transform-origin: left center;
	}

	&__bun {
		&:first-child {
			top: 0;
		}

		&:last-child {
			top: 16px;
		}
	}

	&__meat {
		top: 8px;
	}

	&--open {
		animation: 0.25s 0.25s reverse both;

		.burger__bun {
			&:first-child {
				top: -1px;
				transform: rotate(45deg);
			}

			&:last-child {
				transform: rotate(-45deg);
			}
		}

		.burger__meat {
			width: 0%;
			opacity: 0;
		}
	}
}
</style>
