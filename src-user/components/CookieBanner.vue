<template>
	<div
		v-if="!isHidden"
		class="cookie-banner"
	>
		<div class="cookie-banner__frame">
			<p class="cookie-banner__text">
				This website uses cookies to provide necessary site functionality and to improve your experience.
				By using this website, you agree to our use of cookies.
			</p>

			<button
				class="cookie-banner__close"
				title="Close"
				@click="close"
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M15 5L5 15"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M5 5L15 15"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</div>
	</div>
</template>

<script>
import {
	getCookie,
	setCookie,
} from '@site-modules/utils/cookies';
import { isAppPrerendering } from '@site-modules/utils/isAppPrerendering';

export default {
	data() {
		return {
			isHidden: true,
		};
	},
	mounted() {
		if (!isAppPrerendering) {
			this.isHidden = getCookie(`z-cookies-consent-${document.location.origin}`) === '1';
		}
	},
	methods: {
		close() {
			this.isHidden = true;
			setCookie(`z-cookies-consent-${document.location.origin}`, 1, 365);
		},
	},
};
</script>

<style lang="scss">
.cookie-banner {
	position: fixed;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: z-index(user--cookies);
	padding: 16px;
	background-color: $light;
	border-top: 1px solid $grey-200;

	&__frame {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		max-width: 1240px;
		margin: auto;
	}

	&__text {
		padding-right: 16px;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 20px;
		text-align: left;
		letter-spacing: 0.25px;
	}

	&__close {
		display: block;
		flex-basis: 20px;
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		margin-left: auto;
		color: $grey-800;
		cursor: pointer;
		transition: color 0.2s;

		&:hover,
		&:focus {
			color: $grey-600;
		}
	}
}
</style>
