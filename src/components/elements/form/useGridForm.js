import { computed } from 'vue-demi';

export const useGridForm = (props) => {
	const computedStyles = computed(() => {
		const { styles } = props.data.settings;
		const { styles: buttonStyles } = props.data.submitButtonData.settings;

		return {
			'--formFlex': styles.justify ? null : '0 1 100%',
			'--formButtonJustifySelf': buttonStyles.align,
			'--m-formButtonJustifySelf': buttonStyles['m-align'],
		};
	});

	return {
		computedStyles,
	};
};
