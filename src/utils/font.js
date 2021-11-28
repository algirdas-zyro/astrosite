import {
	FONT,
	PROPERTY_FONT_FAMILY,
	PROPERTY_FONT_PRIMARY,
	PROPERTY_FONT_SECONDARY,
	PROPERTY_FONT_WEIGHT,
	FONT_WEIGHT_ELEMENTS,
} from '../constants/globalStyles';
import { onlyUnique } from '../utils/array/onlyUnique';

const FONT_WEIGHTS_MAP = {
	normal: 400,
	bold: 700,
};

const AVAILABLE_GOOGLE_FONT_WEIGHTS = [
	'100',
	'100italic',
	'200italic',
	'200',
	'300italic',
	'300',
	'regular',
	'italic',
	'400',
	'400italic',
	'500',
	'500italic',
	'600',
	'600italic',
	'700',
	'700italic',
	'800',
	'800italic',
	'900',
	'900italic',
];

// TODO remove after mapper is done
/**
 * Mapper is needed for this to remove, currently our legacy templates
 * have bold for 700 and normal for 400 font weights
 */
export const convertWeightStringToNumber = (fontWeight) => FONT_WEIGHTS_MAP[fontWeight]
	|| Number(fontWeight);

/**
 * @param fontName ''Prata', sans-serif'
 * @returns 'Prata' {String}
 */
export const extractFontName = (fontName) => fontName.split(',')?.[0]?.replace(/'/g, '');

export const constructFontForCSS = (family, fallback) => `'${family}', ${fallback}`;

export const transformFontTypeToVariable = (fontType) => `var(--${FONT}-${fontType})`;

export const replaceSpacesWithPlus = (fontName) => fontName.trim().replace(/ /g, '+');

/**
 * @param variable var(--font-primary) | var(--font-secondary)
 * @returns primary | secondary
 */
export const extractFontTypeFromVariable = (variable) => {
	const regex = new RegExp(`var\\(--${FONT}-|\\)`, 'g');

	return variable.replace(regex, '');
};

export const filterAvailableFontWeightVariants = (variants) => {
	const GOOGLE_FONT_WEIGHT_MAP = {
		regular: 400,
		italic: '400italic',
	};

	return variants
		.filter((variant) => AVAILABLE_GOOGLE_FONT_WEIGHTS.includes(variant))
		.map((variant) => {
			const defaultValue = Number(variant) || variant;

			return GOOGLE_FONT_WEIGHT_MAP[variant] || defaultValue;
		});
};

export const pickUsedFontWeights = (siteStyles) => {
	let usedFontWeights = {
		primary: [],
		secondary: [],
	};

	FONT_WEIGHT_ELEMENTS.forEach((element) => {
		const fontType = extractFontTypeFromVariable(siteStyles[element][PROPERTY_FONT_FAMILY]);
		const fontWeight = convertWeightStringToNumber(siteStyles[element][PROPERTY_FONT_WEIGHT]);

		usedFontWeights = {
			...usedFontWeights,
			[fontType]: [
				...usedFontWeights[fontType],
				fontWeight,
			],
		};
	});

	return {
		[PROPERTY_FONT_PRIMARY]: usedFontWeights[PROPERTY_FONT_PRIMARY].filter(onlyUnique).sort(),
		[PROPERTY_FONT_SECONDARY]: usedFontWeights[PROPERTY_FONT_SECONDARY].filter(onlyUnique).sort(),
	};
};

export const websiteFontNames = (websiteFonts) => ({
	[PROPERTY_FONT_PRIMARY]: extractFontName(websiteFonts[PROPERTY_FONT_PRIMARY]),
	[PROPERTY_FONT_SECONDARY]: extractFontName(websiteFonts[PROPERTY_FONT_SECONDARY]),
});

export const constructMetaFont = (fontNames, fontWeights) => Object.keys(fontNames).map((fontProperty) => ({
	name: replaceSpacesWithPlus(fontNames[fontProperty]),
	weights: fontWeights[fontProperty].join(';'),
}))
	.filter(({ weights }) => !!weights)
	.map((font) => `family=${font.name}:wght@${font.weights}`)
	.join('&');

export const constructFontHref = (styles) => {
	const usedFontWeights = pickUsedFontWeights(styles);
	const usedFontNames = websiteFontNames(styles.font);
	const fontsQuery = constructMetaFont(usedFontNames, usedFontWeights);

	return `https://fonts.googleapis.com/css2?${fontsQuery}&display=swap`;
};
