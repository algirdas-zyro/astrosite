<template>
	<div
		data-qa="builder-gridelement-contactform"
		class="form"
		:class="{ 'form--single-field' : settings.type === 'singleField' }"
		:style="styles"
	>
		<form
			class="form__control"
			:name="formId"
			:class="{ 'form__control--invisible': showSuccessMessage || isError }"
			../../../submit.prevent="handleSubmit"
		>
			<template v-for="(item) in settings.schema">
				<Component
					:is="item.type"
					:key="item.id"
					:theme="theme"
					:data="item"
					:placeholder="item.placeholder"
					:label="item.inputLabel"
					:is-required="validationRules[item.name].validation.includes('required')"
					:validation-errors="validationErrors[item.name]"
					:are-errors-shown="areErrorsVisible"
					:is-interactive="isUserSite"
					../../../input="updateField(item.name, $event)"
				/>
			</template>
			<GridButton
				:content="submitButtonData.content"
				:type="submitButtonData.settings.type"
				class="form__button"
				button-type="submit"
				tag-name="button"
			/>
		</form>
		<slot />
	</div>
</template>
<script>
import GridButton from '../../../components/elements/button/GridButton.vue';
import GridInput from '../../../components/elements/input/GridInput.vue';
import GridSelectInput from '../../../components/elements/input/GridSelectInputsWrapper.vue';
import { validateInput } from '../../../utils/validateInput';

export default {
	components: {
		GridInput,
		GridButton,
		GridSelectInput,
	},
	props: {
		id: {
			type: String,
			required: true,
		},
		settings: {
			type: Object,
			required: true,
		},
		submitButtonData: {
			type: Object,
			required: true,
		},
		formId: {
			type: String,
			default: null,
		},
		styles: {
			type: Object,
			default: null,
		},
		isError: {
			type: Boolean,
			default: false,
		},
		showSuccessMessage: {
			type: Boolean,
			default: false,
		},
		isUserSite: {
			type: Boolean,
			default: false,
		},
		theme: {
			type: String,
			validator: (theme) => [
				'dark',
				'light',
			].includes(theme),
			default: 'light',
		},
	},
	data() {
		return {
			validationErrors: {},
			formValues: {},
			areErrorsVisible: false,
		};
	},
	computed: {
		validationRules() {
			return this.settings.schema.reduce((rules, rowItem) => ({
				...rules,
				[rowItem.name]: {
					validation: rowItem.validation.flat(),
					validationMessages: rowItem['validation-messages'],
				},
			}), {});
		},
	},
	methods: {
		handleSubmit() {
			this.trimFormValues();
			const errors = this.validateForm();

			this.areErrorsVisible = errors.length > 0;

			if (!this.areErrorsVisible) {
				this.$emit('on-submit', this.formValues);
			}
		},
		validateForm() {
			return this.settings.schema.flatMap(({ name }) => {
				const errors = validateInput(this.formValues[name], this.validationRules[name]);

				this.validationErrors = {
					...this.validationErrors,
					[name]: errors,
				};

				return errors;
			});
		},
		updateField(field, value) {
			this.validationErrors = {
				...this.validationErrors,
				[field]: validateInput(value, this.validationRules[field]),
			};
			this.formValues = {
				...this.formValues,
				[field]: value,
			};
		},
		trimFormValues() {
			this.formValues = Object.fromEntries(Object.entries(this.formValues).map(([key, value]) => [
				key,
				value.trim(),
			]));
		},
	},
};
</script>

<style lang="scss" scoped>
../../../include font-style('body', '.form');

.form {
	position: relative;
	display: grid;
	flex: var(--formFlex);
	grid-gap: var(--formSpacing);
	padding: var(--gridItemInnerPadding);
	background:
		$background-overlay-grid-item,
		var(--gridItemInnerBackground);
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;

	::v-deep {
		.formulate-input-errors {
			display: none;
		}
	}

	&--single-field {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr) min-content);
		grid-auto-flow: row;
		grid-gap: var(--formSpacing);
	}

	&__control {
		align-self: center;

		::v-deep {
			display: grid;
			grid-gap: var(--formSpacing);
		}
	}

	&__control-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
		grid-gap: var(--formSpacing);
	}

	&__button,
	&__control {
		&--invisible {
			pointer-events: none;
			opacity: 0;
			transition: opacity 0.15s;
		}
	}

	&__button {
		::v-deep {
			align-self: center;
			justify-self: var(--formButtonJustifySelf);
		}

		&:focus-visible {
			outline: 2px solid #3a97f9;
		}
	}
}

../../../include zyro-media($media-grid) {
	.form {
		padding: var(--m-gridItemInnerPadding, var(--gridItemInnerPadding));

		&__button {
			::v-deep {
				align-self: center;
				justify-self: var(--m-formButtonJustifySelf, var(--formButtonJustifySelf));
			}
		}
	}
}
</style>
