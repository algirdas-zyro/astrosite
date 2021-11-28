/* eslint-disable unicorn/filename-case */
import { computed } from 'vue-demi';

import { parseCSSSides } from '../utils/parseCSSSides';

export const UNFOLDABLE_STYLE_KEYS = [
	'padding',
	'm-padding',
	'block-padding',
];

export const useInlineCSSVariables = (props) => {
	const computedStyles = computed(() => {
		const styles = props.data?.settings?.styles;
		const backgroundExists = props.data?.background?.current;

		let backgroundStyles = {};
		// uses temporary background object for a transparent header.
		// otherwise it would change the original background's color in
		// in preview mode once scrolled to the very top (color: 'transparent')
		const { background } = props.data;

		if (backgroundExists) {
			const useUrl = background.current === 'image';
			const backgroundValue = useUrl ? `url(${background[background.current]})` : background[background.current];

			backgroundStyles = {
				[`--background-${background.current}`]: backgroundValue,
			};
		}

		if (!styles && !backgroundExists) {
			return {};
		}

		return Object.entries(styles).reduce(
			(styleString, [currentStyleKey, currentStyleValue]) => {
				const cssVariableKey = `--${currentStyleKey}`;
				const inlineStyleVariables = UNFOLDABLE_STYLE_KEYS.includes(currentStyleKey)
					? Object.entries(parseCSSSides(currentStyleValue))
						.reduce(
							(styleStringCurrent, [side, value]) => ({
								...styleStringCurrent,
								[`${cssVariableKey}-${side}`]: value,
								[cssVariableKey]: currentStyleValue,

							}), {},
						)
					: ({
						[cssVariableKey]: currentStyleValue,
					});

				return {
					...styleString,
					...inlineStyleVariables,
				};
			},
			backgroundStyles,
		);
	});

	return {
		computedStyles,
	};
};
