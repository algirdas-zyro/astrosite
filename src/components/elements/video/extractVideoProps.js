import {
	PROVIDERS,
	URL_PARAMS,
	URL_REG_EXP,
	DEFAULT_AUTOPLAY_VALUE,
	DEFAULT_CONTROLS_VALUE,
	DEFAULT_LOOP_VALUE,
	DEFAULT_AUTOPAUSE_VALUE,
	DEFAULT_MUTE_VALUE,
	DEFAULT_PLAYSINLINE_VALUE,
	PROVIDERS_BASE_URLS,
	VIMEO_OEMBED_API,
} from '../../../components/elements/video/constants';

export const getVimeoThumbnails = async (id) => {
	const res = await fetch(`${VIMEO_OEMBED_API}/${id}`);
	const data = await res.json();

	/**
	 * thumbnail_url` retrieved from API usually comes with '_295x166' size suffix.
	 * To retrieve higher quality image replace it with higher resolution (via Video thumbnail CDN).
	 *
	 *  NB: video ID is different from thumbnail ID retrieved from Vimeo CDN.
	 */
	const hqThumbnailUrl = data.thumbnail_url.replace('_295x166', '_720');

	return {
		jpg: hqThumbnailUrl.replace('.webp', '.jpg'),
		webp: hqThumbnailUrl.replace('.jpg', '.webp'),
	};
};

// Get thumbnails from either Vimeo API of Youtube image service URLs
export const getThumbnails = async (provider, id) => {
	switch (provider) {
	case PROVIDERS.YOUTUBE: return {
		// TODO: use Youtube oembed API (currently blocked by CORS, so would need a proxy)
		jpg: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
		// webp: `http://i.ytimg.com/vi_webp/${id}/maxresdefault.webp`,
		webp: `https://i.ytimg.com/vi_webp/${id}/hqdefault.webp`,
		// Youtube oembed API would also provide particular sizes for video. Use defaults for now:
	};
	case PROVIDERS.VIMEO: return getVimeoThumbnails(id);
	default: return {
		jpg: null,
		webp: null,
	};
	}
};

// Construct a valid embed URL.
// `id` and `provider` are mandatory.
// Params (`autoplay` and `controls`) will fall back to defaults if not provided.
export const constructEmbedUrl = (id, provider, params) => {
	const muteParamLabel = URL_PARAMS.MUTE[provider];

	const stringifiedParams = new URLSearchParams({
		[URL_PARAMS.PLAYLIST]: id,
		[URL_PARAMS.AUTOPLAY]: params?.[URL_PARAMS.AUTOPLAY] ?? DEFAULT_AUTOPLAY_VALUE,
		[URL_PARAMS.CONTROLS]: params?.[URL_PARAMS.CONTROLS] ?? DEFAULT_CONTROLS_VALUE,
		[URL_PARAMS.LOOP]: params?.[URL_PARAMS.LOOP] ?? DEFAULT_LOOP_VALUE,
		[URL_PARAMS.AUTOPAUSE]: DEFAULT_AUTOPAUSE_VALUE,
		[URL_PARAMS.PLAYSINLINE]: DEFAULT_PLAYSINLINE_VALUE,
		[muteParamLabel]: DEFAULT_MUTE_VALUE,
	}).toString();

	return `${PROVIDERS_BASE_URLS[provider]}${id}?${stringifiedParams}`;
};

// Construct a valid embed URL.
// `id` and `provider` are mandatory.
// Params (`autoplay` and `controls`) will fall back to defaults if not provided.
export const extractVideoParams = (url) => {
	const [, params] = url.split('?');

	return params && params.split('&').reduce((acc, substring) => {
		const [param, value] = substring.split('=');

		return {
			...acc,
			[param]: value,
		};
	}, {});
};

// Valid video URL consists of default video provider URL (fox ex. 'https://www.youtube.com/embed/'),
// and with default query values for toggling (autoplay, loop and video controls).
// Full normalized URL would look like https://www.youtube.com/embed/a1a1a1?autoplay=0&loop=0&controls=1.
// This is done with Vimeo and Youtube videos.
export const extractVideoProps = async (url, params) => {
	const matchResult = Object.entries(URL_REG_EXP).find(([, regExp]) => url?.match(regExp));
	const isUrlValid = matchResult && matchResult.length === 2;

	if (!isUrlValid) {
		return {
			url,
			isUrlValid: false,
		};
	}

	const [provider, providerRegExp] = matchResult;
	const id = url.match(providerRegExp)[1];

	const {
		jpg,
		webp,
	} = await getThumbnails(provider, id);

	return {
		src: constructEmbedUrl(id, provider, params),
		isUrlValid,
		jpg,
		webp,
		provider,
		id,
	};
};
