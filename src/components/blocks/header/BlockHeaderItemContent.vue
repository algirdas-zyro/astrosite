<template>
	<div
		:class="[
			'item-content-wrapper',
			{ 'item-content-wrapper--active': item.isCurrent },
		]"
	>
		<a
			v-qa="item.isCurrent ? `navigationblock-page-active-${item.name}` : `navigationblock-page-${item.name}`"
			class="item-content"
			:target="item.target"
			:rel="item.rel"
			:href="item.url"
			@click="handleClick"
			v-text="item.name"
		/>
		<div
			v-if="item.hasDropdown"
			class="item-content__icon-container-wrapper"
		>
			<button
				class="item-content__icon-container"
				label="Expand dropdown"
				@click="$emit('toggle')"
			>
				<svg
					class="item-content__icon"
					width="10"
					height="7"
					viewBox="0 0 10 7"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M5 6.5L0.669873 0.5L9.33013 0.500001L5 6.5Z"
						fill="currentColor"
					/>
				</svg>
			</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'BlockHeaderItemContent',
	props: {
		item: {
			type: Object,
			required: true,
		},
	},
	methods: {
		handleClick(event) {
			this.$emit('navigation-item-click', {
				navigationItem: this.item,
				event,
				toggle: () => this.$emit('toggle'),
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@include font-style('nav-link', '.item-content');

$underline-space: 7px;

.item-content {
	$this: &;

	position: relative;
	align-self: center;
	margin: 0 0 0 var(--menu-item-spacing);
	color: var(--nav-link-color);
	text-decoration: none;
	white-space: pre-wrap;
	cursor: pointer;

	&__icon-container {
		all: unset;
		display: flex;
		margin-left: 8px;
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
		margin: 2px 6.5px;
		transition: transform 0.3s;
	}
}

.item-content-wrapper {
	display: flex;
	align-items: center;
	text-align: left;

	&--active,
	&:hover,
	&:focus {
		.item-content {
			color: var(--nav-link-color-hover, var(--nav-link-color));
			text-decoration: underline;
			text-underline-offset: $underline-space;

			&__icon-container {
				color: var(--nav-link-color-hover, var(--nav-link-color));
			}
		}
	}
}

@include zyro-media($media-grid) {
	.item-content {
		margin: 0 0 $underline-space 0;

		&__icon-container {
			display: inline-block;
		}
	}
}
</style>
