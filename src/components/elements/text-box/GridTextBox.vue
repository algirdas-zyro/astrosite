<template>
	<div
		class="text-box"
		v-on="$listeners"
		v-html="content"
	/>
</template>

<script>
export default {
	props: {
		content: {
			type: String,
			default: null,
		},
	},
};
</script>

<style lang="scss">
@import '../../../assets/scss/abstracts';
@mixin font-spacing($element, $margin-bottom) {
	#{$element} {
		margin-bottom: $margin-bottom;

		&:last-child {
			margin-bottom: 0;
		}
	}
}

@include font-style('h1', 'h1', '.text-box');
@include font-style('h2', 'h2', '.text-box');
@include font-style('h3', 'h3', '.text-box');
@include font-style('h4', 'h4', '.text-box');
@include font-style('h5', 'h5', '.text-box');
@include font-style('h6', 'h6', '.text-box');
@include font-style('body-large', '.body-large', '.text-box');
@include font-style('body', '.body', '.text-box');
@include font-style('body-small', '.body-small', '.text-box');
@include font-style('button', '.button', '.text-box');
@include font-style('link', '.link', '.text-box');

.text-box {
	width: 100%;
	padding: 0;
	margin: 0;
	white-space: break-spaces;
	outline: none;

		//Font spacing
		@include font-spacing('h1', 48px);
		@include font-spacing('h2, h3, h4, .body-large, .body', 32px);
		@include font-spacing('h5', 16px);
		@include font-spacing('h6', 8px);
		@include font-spacing('.body-small', 24px);

		ol,
		ul {
			padding-left: 40px;
		}

		/**
			* ProseMirror removes <br> tags inside empty paragraphs
			as they are only used as a new line placeholder,
			* but it is intuitive to use as a spacer between text.
			So, we convert all empty p tags to have CSS line-break
			* so that text box would look the same in preview as it does in editor
			*/
		> p:empty::after {
			content: "\00A0";
		}
}

@include zyro-media($media-grid) {
	.text-box {
			//Font spacing
			@include font-spacing('h1', 48px);
			@include font-spacing('h2, h3, h4, .body-large, .body', 32px);
			@include font-spacing('h5', 16px);
			@include font-spacing('h6', 8px);
			@include font-spacing('.body-small', 24px);
	}
}
</style>
