/**
 * Web URL API is not used as it needs core-js runtime polyfill
 * Read more: (https://github.com/zloirock/core-js/issues/117)
 */

import {
	GRID_BREAKPOINT,
	STATIC_ASSETS_BASE_PATH,
} from '../constants';

// Supported Cloudflare origins
// TODO: move to .envs after migration
export const CLOUDFLARE_ORIGINS = [
	STATIC_ASSETS_BASE_PATH,
	'https://assets.zyrosite.space', // staging
	'https://assets.zyrosite.com', // production
];

// Unsplash origin
export const UNSPLASH_ORIGIN = 'https://images.unsplash.com';

// Cloudflare image opzimization prefix for supported origins:
// https://developers.cloudflare.com/images/url-format
export const CLOUDFLARE_PREFIX = 'cdn-cgi/image';

// Mobile device resolutions (can be added later on);
export const MOBILE_RESOLUTIONS = [
	{
		// moto G4, used in Lighthouse
		width: 360,
		height: 640,
	},
];

// Mobile DPI levels (2.625 is XXHDPI Density used in PageSpeed device)
export const MOBILE_DPI_LEVELS = [
	1,
	2,
	2.625,
	3,
];
// Desktop resolutions (used only to trim massive images, usually backgrounds);
export const DESKTOP_RESOLUTIONS = [
	{
		width: 1440,
	},
	{
		width: 1920,
	},
];
// Desktop DPI levels
export const DESKTOP_DPI_LEVELS = [
	1,
	2,
];
// Default offset for mobile devices
export const DEFAULT_MOBILE_PADDING = 16;

/**
 * Preload images by creating new Image() with srcset and sizes attributes.
 * This allows preloading only exact image the user will need from srcset.
 * It is only fired after window load (and listener removed afterwards).
 *
 * @param {string} srcset - a list of image urls with render sizes separated by comma
 * @param {string} sizes - potential CSS render size
 * @param {string} width - image creation width
 *
 */
export const preloadSrcset = (srcset, sizes, width) => {
	const windowLoadHandler = () => {
		const preloadedImage = new Image(width);

		preloadedImage.srcset = srcset;
		preloadedImage.sizes = sizes;
		window.removeEventListener('load', windowLoadHandler);
	};

	window.addEventListener('load', windowLoadHandler);
};

/**
 * Util to find file extension: trim query params, get extenstion string and check if it's 'svg';
 *
 * @param {string} url - input url
 * @return {boolean} - flag to return if path leads to .svg file
 */
export const isSvgFile = (url) => url.split('?')[0].split('.').splice(-1)[0].toLowerCase() === 'svg';
export const isGifFile = (url) => url.split('?')[0].split('.').splice(-1)[0].toLowerCase() === 'gif';

/**
 * Calculate sizes in desktop and mobile resolutions.
 *
 * @param {number} gridItemWidth - width to calculate sizes
 * @param {number} [mobilePadding=DEFAULT_MOBILE_PADDING] - mobile padding to calculate mobile width
 * @return {string} - a cocatenated string of sizes
 */
export const getGridItemSizes = (gridItemWidth, mobilePadding = DEFAULT_MOBILE_PADDING) => [
	`(min-width: ${GRID_BREAKPOINT}px) ${gridItemWidth}px`,
	`calc(100vw - ${mobilePadding * 2}px)`,
].join(', ');

/**
 * Tranform src to Cloudflare-optimized URL
 *
 * @param {string} origin - Cloudflare origin (defined in constants)
 * @param {string} src - image (url)
 * @param {{
 *     width: number,
 *     height: number,
 *     shouldContain: boolean,
 *     isLossless: boolean
 * }} options - Cloudflare optimization options
 * @return {string} - transformed string URL to optimized image
 */
export const getCloudflareSrc = (origin, src, options = {}) => {
	/**
	 * Cloudflare service options: https://developers.cloudflare.com/images/url-format#options
	 * 'format=auto' - picks best supported format (usually webp) via user-agent
	 * 'fit=scale-down' - same as `object-fit: contain` except it doesn't enlarge
	 * 'fit=crop' - same as `object-fit: cover` except it doesn't enlarge (default)
	 */

	const optionString = [
		'format=auto',
		options.width && `w=${options.width}`,
		options.height && `h=${options.height}`,
		options.shouldContain ? 'fit=scale-down' : 'fit=crop',
		options.isLossless && 'q=100', // override default lossy 85
	].filter((param) => !!param).join(',');

	//  Get relative path to image
	let [, path] = src.split(origin);

	// Path usually starts with '/', but can also start with '//' (legacy). Trim it:
	while (path.startsWith('/')) {
		path = path.replace('/', '');
	}

	return `${origin}/${CLOUDFLARE_PREFIX}/${optionString}/${path}`;
};

/**
 * Tranform src to Unsplash-optimized URL
 *
 * @param {string} src - image (url)
 * @param {{
 *     width: number,
 *     height: number,
 *     shouldContain: boolean,
 *     isLossless: boolean
 * }} options - Unsplash optimization options
 * @return {string} - transformed string URL to optimized image
 */
export const getUnsplashSrc = (src, options = {}) => {
	/**
	 * Unsplash service options: https://docs.imgix.com/apis/rendering
	 * 'auto=format' - picks best supported format (usually webp) via user-agent
	 * 'fit=clip' - same as `object-fit: contain` except it doesn't enlarge
	 * 'fit=crop' - same as `object-fit: cover` except it doesn't enlarge (default)
	 */

	const url = new URL(src);

	url.searchParams.set('auto', 'format');
	url.searchParams.set('fit', options.shouldContain ? 'clip' : 'crop');

	if (options.width) {
		url.searchParams.set('w', options.width);
	}

	if (options.height) {
		url.searchParams.set('h', options.height);
	}

	if (options.isLossless) {
		url.searchParams.set('q', 100); // override default lossy 75
	}

	return url.href;
};

/**
 * Take in 'src', check if there are supported providers and optimize it
 *
 * @param {string} src - image (url)
 * @param {{
 *     width: number,
 *     height: number,
 *     shouldContain: boolean,
 *     isLossless: boolean
 * }} options - Unsplash optimization options
 * @return {string} - transformed string URL to optimized image
 */
export const getOptimizedSrc = (src, options = {}) => {
	if (!src) {
		return null;
	}

	// skip SVG and GIF files altogether. larger GIF's are not supported by Cloudflare
	if (isSvgFile(src) || isGifFile(src)) {
		return src;
	}

	const cloudflareOrigin = CLOUDFLARE_ORIGINS.find((origin) => src.includes(origin));

	if (cloudflareOrigin) {
		return getCloudflareSrc(cloudflareOrigin, src, options);
	}

	if (src.includes(UNSPLASH_ORIGIN)) {
		return getUnsplashSrc(src, options);
	}

	return src;
};

/**
 * For backgrounds and images which do not have width/height defined use this.
 * It loops throught defined lists of breakpoints and DPIs
 *
 * @param {string} url - image url
 * @param {{
 *     shouldContain: boolean,
 *     isLossless: boolean
 * }} options - General optimization options
 * @return {string} - a cocatenated string from URLs
 */
export const getFullWidthSrcset = (url, options = {}) => {
	const desktopFullWidthSrcset = DESKTOP_RESOLUTIONS
		.map((resolution) => DESKTOP_DPI_LEVELS
			.map((dpi) => {
				const width = Math.round(resolution.width * dpi);

				return `${getOptimizedSrc(url, {
					...options,
					width,
				})} ${width}w`;
			})).join(',');

	const mobileFullWidthSrcset = MOBILE_RESOLUTIONS
		.map((resolution) => MOBILE_DPI_LEVELS
			.map((dpi) => {
				const width = Math.round(resolution.width * dpi);
				const fullWidthOptions = {
					...options,
					width,
				};

				if (options.isMobileFullScreen) {
					fullWidthOptions.height = Math.round(resolution.height * dpi);
				}

				return `${getOptimizedSrc(url, fullWidthOptions)} ${width}w`;
			})).join(',');

	const srcset = `${mobileFullWidthSrcset},${desktopFullWidthSrcset}`;

	if (options.preload) {
		preloadSrcset(srcset, '100vw', window.innerWidth);
	}

	return srcset;
};

/**
 * For images which have width and height generate srcset for particular size.
 *
 * @param {string} url - image url
 * @param {{
 *     width: number,
 *     height: number,
 *     shouldContain: boolean,
 *     isLossless: boolean,
 *     mobilePadding: number
 * }} options - General optimization options
 * @return {string} - a cocatenated string from URLs
 */
export const getGridItemSrcset = (url, options = {}) => {
	// if no width was passed, fall back to getFullWidthSrcset()
	if (!options.width) {
		return getFullWidthSrcset(url, options);
	}

	const desktopGridSrcset = DESKTOP_DPI_LEVELS.map((dpi) => {
		const scaledWidth = Math.round(options.width * dpi);
		const scaledHeight = Math.round(options.height * dpi);
		const optimizedSrc = getOptimizedSrc(url, {
			...options,
			width: scaledWidth,
			height: scaledHeight,
		});

		return `${optimizedSrc} ${scaledWidth}w`;
	}).join(',');

	// Pin mobile offset from sides - we'll need to subtract it
	const mobileOffset = (options.mobilePadding ?? DEFAULT_MOBILE_PADDING) * 2;
	// Loop through all defined mobile resolutions:
	const mobileGridSrcset = MOBILE_RESOLUTIONS.map((resolution) => {
		// Get CSS width of render area
		const cssWidth = resolution.width - mobileOffset;

		// Loop through all DPI levels and multiply css render area size by DPI
		return MOBILE_DPI_LEVELS.map((dpi) => {
			// Get ratio from props
			const ratio = options.width / options.height;
			// Get image width at that resolution
			const scaledWidth = Math.round(cssWidth * dpi);
			// Calculate height at current width
			const scaledHeight = Math.round(scaledWidth / ratio);
			const optimizedSrc = getOptimizedSrc(url, {
				...options,
				width: scaledWidth,
				height: scaledHeight,
			});

			return `${optimizedSrc} ${scaledWidth}w`;
		}).join(',');
	}).join(',');

	const srcset = `${mobileGridSrcset},${desktopGridSrcset}`;

	if (options.preload) {
		preloadSrcset(srcset, getGridItemSizes(options.width), options.width);
	}

	return srcset;
};

/**
 * For images which have width and height generate srcset for particular size.
 *
 * @param {string} url - image url
 * @param {{
 *     width: number,
 *     height: number,
 *     shouldContain: boolean,
 *     isLossless: boolean,
 *     mobilePadding: number
 *     columnGap: number
 *     columnCount: number
 *     isMasonryLayout: boolean
 * }} options - General optimization options
 * @return {string} - a cocatenated string from URLs
 */

export const getGridGallerySrcset = (url, options = {}) => {
	// if no width was passed, fall back to getFullWidthSrcset()
	if (!options.width) {
		return getFullWidthSrcset(url, options);
	}

	const desktopGridSrcset = DESKTOP_DPI_LEVELS.map((dpi) => {
		const scaledWidth = Math.round(options.width * dpi);
		const scaledHeight = Math.round(options.height * dpi);
		const optimizedSrc = getOptimizedSrc(url, {
			...options,
			width: scaledWidth,
			height: scaledHeight,
		});

		return `${optimizedSrc} ${scaledWidth}w`;
	}).join(',');

	// Pin mobile offset from sides - we'll need to subtract it
	const mobileOffset = (options.mobilePadding ?? DEFAULT_MOBILE_PADDING) * 2;
	// Loop through all defined mobile resolutions:
	const mobileGridSrcset = MOBILE_RESOLUTIONS.map((resolution) => {
		// Get CSS width of render area
		const cssWidth = Math.round((resolution.width - mobileOffset + options.columnGap) / options.columnCount - options.columnGap);

		// Loop through all DPI levels and multiply css render area size by DPI
		return MOBILE_DPI_LEVELS.map((dpi) => {
			// Get image width at that resolution
			const scaledWidth = Math.round(cssWidth * dpi);
			// Calculate height at current width
			const size = Math.round(cssWidth * dpi);
			const optimizedSrc = getOptimizedSrc(url, {
				...options,
				width: size,
				// Use same size for height only if is used not in masonry
				height: !options.isMasonryLayout && size,
			});

			return `${optimizedSrc} ${scaledWidth}w`;
		}).join(',');
	}).join(',');

	return `${mobileGridSrcset},${desktopGridSrcset}`;
};
