<template>
	<div class="video">
		<iframe
			v-if="renderIframe"
			:src="src"
			class="video__frame"
			allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			width="100%"
			height="100%"
		/>
		<template v-else-if="renderPicture && (jpg || webp)">
			<picture>
				<source
					type="image/webp"
					:srcset="webp"
				>
				<img
					referrerpolicy="origin"
					class="video__placeholder"
					height="100%"
					width="100%"
					data-qa="builder-gridelement-video"
					:src="jpg"
				>
			</picture>
			<button
				type="button"
				:class="`video__play video__play--${provider}`"
			/>
		</template>
	</div>
</template>

<script>
import { PROVIDERS } from '../../../components/elements/video/constants';

export default {
	name: 'GridVideo',
	props: {
		renderIframe: {
			type: Boolean,
			default: false,
		},
		renderPicture: {
			type: Boolean,
			default: true,
		},
		src: {
			type: String,
			required: true,
		},
		provider: {
			type: String,
			default: PROVIDERS.YOUTUBE,
		},
		jpg: {
			type: String,
			default: '',
		},
		webp: {
			type: String,
			default: '',
		},
	},
};
</script>

<style lang="scss">
.video {
	position: relative;
	width: 100%;
	height: 100%;
	cursor: pointer;
	background-color: #000;

	&__frame,
	&__placeholder {
		position: absolute;
		top: 0;
		left: 0;
		display: block;
		width: 100%;
		height: 100%;
	}

	&__placeholder {
		object-fit: cover;
	}

	&__play {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 68px;
		height: 48px;
		padding: 0;
		margin-top: -24px;
		margin-left: -34px;
		color: #fff;
		text-align: center;
		text-indent: 1px;
		background-color: rgba(30, 30, 30, 0.8);
		border-radius: 15% / 40%;
		transition: background-color 150ms ease-out;

		&::before {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 0;
			height: 0;
			margin-top: -10px;
			margin-left: -9px;
			content: '';
			border-color: transparent transparent transparent #fff;
			border-style: solid;
			border-width: 10px 0 10px 18px;
		}

		&--vimeo {
			background-color: rgba(30, 30, 30, 0.9);
			border-radius: 5px;
		}
	}

	&:hover {
		.video {
			&__play {
				background-color: #f00;

				&--vimeo {
					background-color: rgb(0, 102, 153);
				}
			}
		}
	}
}

@include zyro-media($media-grid) {
	.video {
		position: relative;
		padding-top: 56.25%;
	}
}
</style>
