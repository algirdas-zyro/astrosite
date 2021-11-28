<template>
	<div
		:class="computedClass"
		:style="computedStyles"
	>
		<a
			v-for="({ link, svg }) in links"
			:key="link"
			:href="link"
			target="_blank"
			class="social-icons__link"
			v-on="{
				dragstart: preventLinks ? (e) => e.preventDefault() : () => null,
				click: preventLinks ? (e) => e.preventDefault() : () => null,
			}"
			v-html="svg"
		/>
	</div>
</template>

<script>
export default {
	props: {
		links: {
			type: Array,
			default: () => ([]),
		},
		preventLinks: {
			type: Boolean,
			default: false,
		},
		direction: {
			type: String,
			validator: (value) => [
				'row',
				'column',
			].includes(value),
			default: 'row',
		},
		directionMobile: {
			type: String,
			validator: (value) => [
				'row',
				'column',
			].includes(value),
			default: null,
		},
		preventSpacing: {
			type: Boolean,
			default: false,
		},
		fullHeight: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		computedClass() {
			return [
				'social-icons',
				`social-icons--${this.direction}`,
			];
		},
		computedStyles() {
			return {
				...(this.fullHeight && {
					height: '100%',
				}),
				...(this.preventSpacing && {
					'--space-between-icons': '0px',
				}),
				'--iconDirectionMobile': this.directionMobile || this.direction,
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.social-icons {
	display: flex;
	flex-direction: var(--icon-direction);
	justify-content: var(--icon-spacing, start);
	max-height: 100%;
	padding: 10px;
	padding: var(--gridItemInnerPadding);
	background: var(--gridItemInnerBackground);
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;

	&__link {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: calc(var(--space-between-icons) / 2);
		line-height: 1;
		color: var(--icon-color, black);
		transition: color 0.2s ease;

		&:hover {
			color: var(--icon-color-hover, var(--colors-grey-800));
		}

		::v-deep svg {
			width: var(--icon-size, 25px);
			height: var(--icon-size, 25px);
			object-fit: contain;
		}
	}
}

@include zyro-media($media-grid) {
	.social-icons {
		flex-direction: var(--iconDirectionMobile);
	}
}
</style>
