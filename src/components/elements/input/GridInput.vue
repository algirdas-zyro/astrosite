<template>
	<div
		class="input"
		:class="`input--${theme}`"
	>
		<label
			class="input__label"
			:class="`input__label--${theme}`"
		>
			{{ label }}{{ isRequired ? '*' : '' }}
		</label>
		<Component
			:is="data.tag || 'input'"
			:placeholder="placeholder"
			type="text"
			class="input__component"
			:class="computedClasses"
			:readonly="!isInteractive"
			:tabindex="isInteractive ? 0 : -1"
			@input="$emit('input', $event.target.value)"
			@click.prevent
			@dragstart.prevent
			@drag.prevent
		/>
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
export default {
	props: {
		label: {
			type: String,
			default: null,
		},
		placeholder: {
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
	computed: {
		computedClasses() {
			return [
				{
					'input__component--textarea': this.data.tag === 'textarea',
				},
				{
					'input__component--read-only': !this.isInteractive,
				},
				`input__component--${this.theme}`,
			];
		},
	},
};
</script>

<style lang="scss" scoped>
@mixin placeholder {
	@include font-style('body', '.input__component');
	::placeholder { @content; }
}

.input {
	@include placeholder {
		font-size: 14px;
		color: var(--colors-grey-600);
	}

	&--dark {
		@include placeholder {
			font-size: 14px;
			color: var(--colors-grey-800);
		}
	}

	&__label {
		color: var(--colors-dark);

		&--dark {
			color: var(--colors-grey-100);
		}
	}

	&__component {
		width: 100%;
		height: 48px;
		padding: 16px 56px 16px 16px;
		background-color: var(--colors-grey-100);
		border: none;
		outline: none;

		&--read-only {
			cursor: move;
		}

		&--textarea {
			min-height: 96px;
			overflow: auto;
			resize: vertical;
		}

		&--dark {
			background-color: rgba($grey-100, 0.6);
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
