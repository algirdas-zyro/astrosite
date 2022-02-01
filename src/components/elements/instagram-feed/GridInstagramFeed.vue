<template>
	<div
		class="instagram-feed"
	>
		<template
			v-for="({ src, alt, href }, index) in media"
		>
			<a
				v-if="src"
				:key="src"
				class="instagram-feed__media-wrapper"
				:href="href"
				target="_blank"
			>
				<figure>
					<video
						v-if="src.includes('video')"
						:src="src"
						class="instagram-feed__media"
						controls
					/>
					<img
						v-else
						:src="src"
						:alt="alt"
						class="instagram-feed__media"
					>
				</figure>
			</a>

			<div
				v-else
				:key="index"
				class="instagram-feed__placeholder"
			/>
		</template>
	</div>
</template>

<script>
export default {
	props: {
		media: {
			type: Array,
			default: () => [],
		},
	},
};
</script>

<style lang="scss">
.instagram-feed {
	display: grid;
	grid-template-columns: repeat(var(--items-per-row), 1fr);
	grid-auto-rows: 1fr;
	grid-gap: var(--item-gap);
	width: 100%;

	&::before {
		grid-area: 1/1/1/1;
		padding-bottom: 100%;
		content: '';
	}

	&__media-wrapper {
		position: relative;

		&:first-child {
			grid-area: 1/1/1/1;
		}
	}

	&__media {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		font-size: 0; // hide alt text in loading state
		background-color: $grey-300;
		object-fit: cover;
	}

	&::before,
	&__placeholder {
		width: 100%;
		background: linear-gradient(90deg, $grey-300, $grey-100);
		background-size: 400% 400%;
		animation: blink 3s ease infinite;
	}

	&__placeholder {
		&:last-child {
			display: none;
		}
	}
}

@include zyro-media($media-grid) {
	.instagram-feed {
		grid-template-columns: repeat(var(--m-items-per-row), 1fr);
		grid-gap: var(--m-item-gap);
	}
}

@keyframes blink {
	0% { background-position: 0% 53%; }
	50% { background-position: 100% 48%; }
	100% { background-position: 0% 53%; }
}
</style>
