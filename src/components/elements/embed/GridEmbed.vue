<template>
	<div
		class="grid-embed"
		data-qa="builder-gridelement-embedcode"
		:style="computedStyles"
	>
		<iframe
			v-if="shouldRender"
			ref="gridEmbedIframeRef"
			class="grid-embed__iframe"
			:srcdoc="srcdoc"
			title="custom code element"
			@load="observeGridEmbed"
		/>
	</div>
</template>

<script>

export default {
	props: {
		srcdoc: {
			type: String,
			default: '',
		},
		shouldRender: {
			type: Boolean,
			default: false,
		},
		height: {
			type: Number,
			default: null,
		},
	},
	data() {
		return {
			observedHeight: null,
		};
	},
	computed: {
		embedHeight() {
			if (this.height && (this.observedHeight > this.height)) {
				return this.observedHeight;
			}

			return this.height ?? this.observedHeight;
		},
		computedStyles() {
			return {
				'--height': `${this.embedHeight}px`,
			};
		},
	},
	methods: {
		observeGridEmbed() {
			const iframeHtml = this.$refs.gridEmbedIframeRef.contentWindow.document.querySelector('html');

			const observerResizer = new ResizeObserver(([{ contentRect }]) => {
				requestAnimationFrame(() => {
					const { height } = contentRect;

					if (height !== this.observedHeight) {
						this.observedHeight = height;
						this.$emit('iframe-height-updated', this.observedHeight);
					}
				});
			});

			observerResizer.observe(iframeHtml);
		},
	},
};
</script>

<style lang="scss">
.grid-embed {
	width: 100%;
	height: 100%;

	&__iframe {
		width: 100%;
		height: var(--height);
		overflow: hidden;
		border: none;
	}
}
</style>
