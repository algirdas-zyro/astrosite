import {
	VALIDATE_EMAIL_REG_EXP,
	VALIDATE_PHONE_NUMBER_REG_EXP,
} from '../constants/regex';

export const validateInput = (value = '', {
	validation,
	validationMessages,
}) => {
	const validationErrors = [];

	if (validation.includes('required') && !value.replace(/ /g, '')) {
		validationErrors.push(validationMessages.required);
	}

	if (!value.replace(/ /g, '')) {
		return validationErrors;
	}

	if (validation.includes('email') && !VALIDATE_EMAIL_REG_EXP.test(value)) {
		validationErrors.push(validationMessages.email);
	}

	// TODO this validation type needs to be replaced once schema is updated
	if (validation.includes('matches') && !VALIDATE_PHONE_NUMBER_REG_EXP.test(value)) {
		validationErrors.push(validationMessages.matches);
	}

	return validationErrors;
};
