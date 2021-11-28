<template>
	<div
		class="input"
		:class="`input--${theme}`"
	>
		<label
			class="input__label input__label--read-only"
			:class="[`input__label--${theme}`]"
		>
			{{ label }}{{ isRequired ? '*' : '' }}
		</label>
		<div
			v-for="option in options"
			:key="option.id"
			class="input__options"
		>
			<SelectInput
				:id="option.id"
				:name="option.value"
				:tag="data.tag"
				:is-selected="option.isSelected"
				:theme="theme"
				:is-interactive="isInteractive"
				:selected-options="selectedOptions"
				@remove-selection="removeSelection"
				@add-selection="addSelection"
				@select-option="selectOption"
			/>
		</div>
		<div v-if="validationErrors.length && areErrorsShown">
			<p
				v-for="message in validationErrors"
				:key="message"
				class="input__error-message z-body-small"
			>
				{{ message }}
			</p>
		</div>
	</div>
</template>

<script>
import SelectInput from './GridSelectInput.vue';

export default {
	components: {
		SelectInput,
	},
	props: {
		label: {
			type: String,
			default: null,
		},
		isRequired: {
			type: Boolean,
			default: false,
		},
		isTextArea: {
			type: Boolean,
			default: false,
		},
		isInteractive: {
			type: Boolean,
			default: true,
		},
		areErrorsShown: {
			type: Boolean,
			default: false,
		},
		validationErrors: {
			type: Array,
			required: false,
			default: () => [],
		},
		theme: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			selectedOptions: [],
		};
	},
	computed: {
		options() {
			return this.data.options.map((option) => {
				const isSelected = this.selectedOptions.some(({ id }) => id === option.id);

				return {
					...option,
					isSelected,
				};
			});
		},
	},
	watch: {
		selectedOptions() {
			const resultValues = this.selectedOptions.map(({ value }) => value).toString();

			this.$emit('input', resultValues);
		},
	},
	methods: {
		removeSelection(selection) {
			const updatedSelection = this.selectedOptions.filter((option) => option.id !== selection.id);

			this.selectedOptions = updatedSelection;
		},
		addSelection(selection) {
			this.selectedOptions.push({
				...selection,
			});
		},
		selectOption(selection) {
			this.selectedOptions = [selection];
		},
	},
};
</script>

<style lang="scss" scoped>
.input {
	&__label {
		color: var(--colors-dark);

		&--dark {
			color: var(--colors-grey-100);
		}

		&--read-only {
			cursor: move;
		}
	}

	&__error-message {
		color: var(--colors-grey-600);
	}

	&--is-invalid {
		.input__component {
			border-color: var(--colors-danger);
		}
	}
}
</style>
