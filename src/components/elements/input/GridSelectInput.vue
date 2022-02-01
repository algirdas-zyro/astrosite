<template>
	<label
		class="select-input"
		:class="labelClasses"
		:for="id"
	>
		<input
			:id="id"
			:key="isSelected"
			:type="tag"
			class="select-input__input"
			:class="inputClasses"
			:checked="isSelected"
			:tabindex="isInteractive ? 0 : -1"
			@input="selectOption"
			@dragstart.prevent
			@drag.prevent
		>
		{{ name }}
	</label>
</template>
<script>

export default {
	props: {
		name: {
			type: String,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
		tag: {
			type: String,
			required: true,
		},
		selectedOptions: {
			type: Array,
			required: true,
		},
		isInteractive: {
			type: Boolean,
			default: true,
		},
		theme: {
			type: String,
			required: true,
		},
		isSelected: {
			type: Boolean,
			require: true,
		},
	},
	computed: {
		labelClasses() {
			return [
				{
					'input__label--read-only': !this.isInteractive,
				},
				`input__label--${this.theme}`,
			];
		},
		inputClasses() {
			return [
				{
					'input__component--read-only': !this.isInteractive,
				},
			];
		},
	},
	methods: {
		selectOption() {
			if (!this.isInteractive) {
				return;
			}

			const selection = {
				id: this.id,
				value: this.name,
			};

			if (this.tag !== 'checkbox') {
				this.$emit('select-option', selection);
			} else if (this.isSelected) {
				this.$emit('remove-selection', selection);
			} else {
				this.$emit('add-selection', selection);
			}
		},
	},

};
</script>
<style lang="scss">
.select-input {
	color: var(--colors-dark);

	&--dark {
		color: var(--colors-grey-100);
	}

	&--read-only {
		cursor: move;
	}

	&__input {
		cursor: pointer;

		&--read-only {
			cursor: move;
		}
	}
}
</style>
