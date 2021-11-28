<template>
	<Component
		:is="tagName"
		:type="buttonType"
		:name="buttonType"
		:href="href"
		:disabled="isDisabled"
		:target="target"
		:rel="rel"
		class="grid-button"
		:class="computedClass"
		:aria-hidden="isLoading"
		@click="$emit('click', $event)"
		@drag="$emit('drag', $event)"
		@dragstart="$emit('dragstart', $event)"
		v-text="content"
	/>
</template>

<script>
export default {
	name: 'GridButton',
	props: {
		tagName: {
			type: String,
			default: 'a',
		},
		href: {
			type: String,
			default: null,
		},
		target: {
			type: String,
			default: null,
		},
		rel: {
			type: String,
			default: null,
		},
		type: {
			type: String,
			default: 'primary',
		},
		buttonType: {
			type: String,
			default: null,
		},
		content: {
			type: String,
			default: '',
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		isLoading: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		computedClass() {
			return {
				'grid-button--empty': !this.content,
				[`grid-button--${this.type}`]: this.type,
				loading: this.isLoading,
			};
		},
	},
};
</script>

<style lang="scss" scoped>
$states: 'hover';

// '/00A0;' is non breaking space html entity code, does not work as a constant or v-text,
// it's used to prevent button from collapsing when it has no content
// v-text adds whitespace around content and makes safari clip text

.grid-button--empty {
	&::after {
		content: '\00A0';
	}
}

@mixin button-mobile($prefix) {
	padding:
		var(--#{$prefix}-m-padding-y, var(--#{$prefix}-padding-y))
		var(--#{$prefix}-m-padding-x, var(--#{$prefix}-padding-x));
	font-size: var(--#{$prefix}-m-font-size, var(--#{$prefix}-font-size));
	border-radius: var(--#{$prefix}-m-border-radius, var(--#{$prefix}-border-radius));
}

@mixin button($name) {
	$prefix: 'grid-button-#{$name}';

	.grid-button--#{$name} {
		display: inline-block;
		max-width: 100%;
		min-height: var(--#{$prefix}-min-height);
		padding: var(--#{$prefix}-padding-y) var(--#{$prefix}-padding-x);
		overflow: hidden;
		font-family: var(--#{$prefix}-font-family);
		font-size: var(--#{$prefix}-font-size);
		font-style: var(--#{$prefix}-font-style);
		font-weight: var(--#{$prefix}-font-weight);
		line-height: var(--#{$prefix}-line-height);
		color: var(--#{$prefix}-color);
		text-align: center;
		text-decoration: var(--#{$prefix}-text-decoration);
		text-overflow: ellipsis;
		text-transform: var(--#{$prefix}-text-transform);
		letter-spacing: var(--#{$prefix}-letter-spacing);
		white-space: nowrap;
		cursor: pointer;
		background-color: var(--#{$prefix}-background-color-null, var(--#{$prefix}-background-color));
		border:
			var(
				--#{$prefix}-border-null,
				var(--#{$prefix}-border-width) solid var(--#{$prefix}-border-color)
			);
		border-radius: var(--#{$prefix}-border-radius);
		box-shadow:
			var(
				--#{$prefix}-box-shadow-null,
				var(--#{$prefix}-box-shadow-x)
				var(--#{$prefix}-box-shadow-y)
				var(--#{$prefix}-box-shadow-blur)
				var(--#{$prefix}-box-shadow-spread)
				var(--#{$prefix}-box-shadow-color)
			);
		transition:
			all var(--#{$prefix}-transition-duration)
			var(--#{$prefix}-transition-timing-function);

		@each $state in $states {
			&:#{$state} {
				color: var(--#{$prefix}-color-#{$state});
				background-color:
					var(
						--#{$prefix}-background-color-null-#{$state},
						var(--#{$prefix}-background-color-#{$state})
					);
				border:
					var(
						--#{$prefix}-border-null-#{$state},
						var(--#{$prefix}-border-width-#{$state}) solid var(--#{$prefix}-border-color-#{$state})
					);
				box-shadow:
					var(
						--#{$prefix}-box-shadow-null-#{$state},
						var(--#{$prefix}-box-shadow-x-#{$state})
						var(--#{$prefix}-box-shadow-y-#{$state})
						var(--#{$prefix}-box-shadow-blur-#{$state})
						var(--#{$prefix}-box-shadow-spread-#{$state})
						var(--#{$prefix}-box-shadow-color-#{$state})
					);
			}
		}

		&:disabled {
			opacity: 0.4;
		}
	}

	.grid-button-#{$name}-mobile {
		@include button-mobile($prefix);
	}

	@include zyro-media($media-grid) {
		.grid-button--#{$name} {
			@include button-mobile($prefix);
		}
	}
}

@include button('primary');
@include button('secondary');

.loading {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: transparent;

	&:not(.s) {
		pointer-events: none;
	}

	&:hover,
	&:focus {
		color: transparent;
	}

	&::before {
		position: absolute;
		width: 16px;
		height: 16px;
		content: "";
		border: 2px solid rgba($dark, 0.5);
		border-top: 2px solid $light;
		border-radius: 50%;
		animation: loading 0.8s linear infinite;
	}
}

@keyframes loading {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
