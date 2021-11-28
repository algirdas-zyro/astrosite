import {
	computed,
	getCurrentInstance,
} from 'vue-demi';

import { UNFOLDABLE_STYLE_KEYS } from './useInlineCSSVariables';

import { parseCSSSides } from '../utils/parseCSSSides';

/**
 * Recursive function which constructs a CSS variable object
 *
 * 1) Prefixes current key with previousKey, if provided
 * 2) If current value is an object, recurses and passes the prefixed key as previousKey.
 * If it is not an object, there is no deeper nesting,
 * so constructed key and the value is added to the returned object.
 *
 * @param {object} obj Object to be converted to CSS variables
 * @param {string} previousKey Used in recurssion as prefix to current key
 * @returns {object} Object of constructed CSS variables
 */
export const objectToCSSVariables = (object, previousKey = '') => Object.entries(object)
	.reduce((accumulator, [key, value]) => {
		const cssVariableKey = previousKey ? `${previousKey}-${key}` : `--${key}`;

		// if value is an object (via @/utils/isObject):
		if (Object.prototype.toString.call(value) === '[object Object]') {
			return {
				...accumulator,
				...objectToCSSVariables(value, cssVariableKey),
			};
		}

		const newStyle = UNFOLDABLE_STYLE_KEYS.includes(key)
			? Object.entries(parseCSSSides(value))
				.reduce(
					(styleStringCurrent, [side, styleValue]) => ({
						...styleStringCurrent,
						[`${cssVariableKey}-${side}`]: styleValue,
						[cssVariableKey]: value,
					}), {},
				)
			: ({
				[cssVariableKey]: value,
			});

		return {
			...accumulator,
			...newStyle,
		};
	}, {});

export const useSiteStyles = () => {
	const siteCSSVariables = computed(() => {
		const styles = getCurrentInstance()?.proxy?.$store?.state?.website?.styles || {};

		return objectToCSSVariables(styles);
	});

	return {
		siteCSSVariables,
	};
};
