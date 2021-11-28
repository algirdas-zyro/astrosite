<template>
	<div
		v-if="slideCount !== null"
		class="nav-bottom"
	>
		<button
			v-for="(slideNumber, index) in slideCount"
			:key="`${slideNumber}${index}`"
			class="nav-bottom__indicator"
			:class="{ 'nav-bottom__indicator--active': index === activeSlideIndex }"
			:title="`Slideshow bottom navigation bullet ${slideNumber}`"
			@click="$emit('indicator:click', index)"
		/>
	</div>
</template>

<script>
export default {
	name: 'SlideshowNavBottom',
	props: {
		slideCount: {
			type: Number,
			default: null,
		},
		activeSlideIndex: {
			type: Number,
			default: null,
		},
	},
};
</script>

<style scoped lang="scss">
.nav-bottom {
	position: absolute;
	right: 0;
	bottom: 32px;
	left: 0;
	z-index: z-index(controls--slideshow);
	display: flex;
	justify-content: center;

	&__indicator {
		width: 10px;
		height: 10px;
		background-color: var(--navigationBulletsColor);
		border-radius: 50%;
		opacity: 0.5;
		transition: background-color ease 0.15s;

		&:hover,
		&:focus-visible {
			cursor: pointer;
			opacity: 1;
		}

		&:not(:last-child) {
			margin-right: 8px;
		}

		&--active {
			opacity: 1;
		}
	}
}
</style>
