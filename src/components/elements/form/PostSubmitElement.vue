<template>
	<Transition name="feed">
		<div
			v-if="isLoading || showSuccessMessage || isError"
			class="submit-message"
			:class="`submit-message--${theme}`"
		>
			<div v-if="isLoading">
				<ZyroLoader />
			</div>
			<div
				v-else-if="showSuccessMessage && !isError"
				class="success-message__heading"
			>
				{{ successMessage }}
			</div>
			<div v-if="isError && !isLoading">
				<div class="submit-message__heading">
					Something went wrong
				</div>
				<div>
					Please try again later
				</div>
			</div>
		</div>
	</Transition>
</template>

<script>
import ZyroLoader from '../../../components/ZyroLoader.vue';
import {
	THEMES,
	THEME_LIGHT,
} from '../../../components/elements/form/constants';

export default {
	components: {
		ZyroLoader,
	},
	props: {
		successMessage: {
			type: String,
			default: '',
		},
		isError: {
			type: Boolean,
			default: false,
		},
		isLoading: {
			type: Boolean,
			default: false,
		},
		showSuccessMessage: {
			type: Boolean,
			default: false,
		},
		theme: {
			type: String,
			validator: (theme) => THEMES.includes(theme),
			default: THEME_LIGHT,
		},
	},
};
</script>

<style lang="scss">
.submit-message {
	position: absolute;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	place-items: center;
	place-content: center;
	width: 100%;
	height: 100%;
	padding: 24px;
	text-align: center;
	border: 1px solid var(--colors-grey-200);

	&--dark {
		color: var(--colors-light);
	}

	&__heading {
		margin-bottom: var(--formSpacing);
	}
}
</style>
