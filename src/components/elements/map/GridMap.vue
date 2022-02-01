<template>
	<div
		class="grid-map"
		:class="{ 'grid-map--loading': !isIframeLoaded }"
	>
		<iframe
			ref="iframeRef"
			class="grid-map__frame"
			width="100%"
			height="100%"
			:src="renderSrc"
		/>
		<div
			v-show="!isIframeLoaded"
			class="grid-map__pin"
		/>
	</div>
</template>

<script>
export default {
	name: 'GridMap',
	props: {
		isIframeLoaded: {
			type: Boolean,
			default: false,
		},
		shouldRender: {
			type: Boolean,
			default: true,
		},
		src: {
			type: String,
			required: true,
		},
	},
	computed: {
		renderSrc() {
			return this.shouldRender && this.src;
		},
	},
};
</script>

<style lang="scss">
.grid-map {
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #ceeece;

	&__frame {
		width: 100%;
		height: 100%;
	}

	&__pin {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 2;
		width: 26px;
		height: 26px;
		margin-top: -37px;
		margin-left: -13px;
		background-color: #ea4436;
		border-radius: 50%;

		&::before {
			position: absolute;
			top: 8px;
			left: 8px;
			z-index: 2;
			width: 10px;
			height: 10px;
			content: '';
			background: #a50f0f;
			border-radius: 50%;
		}

		&::after {
			position: absolute;
			top: 17px;
			right: 1px;
			left: 1px;
			z-index: 1;
			width: 0;
			height: 0;
			content: '';
			border-top: 20px solid #ea4436;
			border-right: 12px solid transparent;
			border-left: 12px solid transparent;
		}
	}

	&--loading {
		@include skeletonPlaceholder();
	}
}
</style>
