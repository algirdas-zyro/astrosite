<template>
	<Transition
		:name="transitionName"
		@before-enter="$emit('transition-start')"
		@after-leave="$emit('transition-end')"
	>
		<div
			v-show="isActive"
			class="slide"
		>
			<slot />
		</div>
	</Transition>
</template>

<script>
import {
	DIRECTION_LEFT,
	DIRECTION_RIGHT,
} from '../../../components/blocks/slideshow/useBlockSlideshow';

export default {
	name: 'SliderSlide',
	props: {
		isActive: {
			type: Boolean,
			default: false,
		},
		slidingDirection: {
			type: String,
			default: DIRECTION_LEFT,
			validator: (prop) => prop === DIRECTION_LEFT || prop === DIRECTION_RIGHT,
		},
		transitionType: {
			type: String,
			default: 'slide',
		},
	},
	computed: {
		transitionName() {
			return `${this.transitionType}${this.slidingDirection}`;
		},
	},
	destroyed() {
		/**
		 * This is needed for a bug when slide is deleted and you are on that active slide
		 * it emits that transition has started, but as the slide is already destroyed it does not
		 * emit slide transition end and thus does not set that isSlideTransitioning to false
		 * This makes sure if slide is deleted if will set isSlideTransitioning to false if slide is destroyed
		 */
		this.$emit('disable-transition-after-ms', 100);
	},
};
</script>

<style lang="scss">
.slide {
	padding-top: var(--header-height, 0);
	margin-top: calc(-1 * var(--header-height, 0));
}

.slideright-leave-active,
.slideright-enter-active,
.slideleft-leave-active,
.slideleft-enter-active {
	transition: 1s;

	// This is only needed while tansitioning slides with fixed backgrounds. See useBlockSlideshow.js
	.background__image--fixed {
		position: absolute;
		top: var(--fixedImage-top);
		left: var(--fixedImage-left);
		width: calc(100% - var(--fixedImage-left));
		height: 100vh;
	}
}

.slideright-leave-active,
.slideleft-leave-active {
	position: absolute;
	top: var(--header-height, 0);
	width: 100%;
}

.slideright-enter {
	transform: translate(100%, 0);
}

.slideright-leave-to {
	right: -1px;
	transform: translate(-100%, 0);
}

.slideleft-enter {
	transform: translate(-100%, 0);
}

.slideleft-leave-to {
	right: 1px;
	transform: translate(100%, 0);
}
</style>
