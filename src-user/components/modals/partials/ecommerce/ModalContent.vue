<template>
	<div class="payment-info">
		<div class="payment-info__content">
			<h5 class="payment-info__title">
				{{ title }}
			</h5>
			<p class="payment-info__text body-large">
				{{ text }}
			</p>
			<GridButton
				class="payment-info__button"
				:content="buttonText"
				type="primary"
				@click="$emit('handle-close')"
			/>
		</div>
	</div>
</template>

<script>
import GridButton from '@site-modules/components/elements/button/GridButton.vue';

export default {
	components: {
		GridButton,
	},
	props: {
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		buttonText: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
@import './styles.scss';
</style>
