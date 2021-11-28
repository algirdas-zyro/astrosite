export const PROVIDERS = {
	YOUTUBE: 'youtube',
	VIMEO: 'vimeo',
};

export const DEFAULT_WIDTH = 560;
export const DEFAULT_HEIGHT = 340;

export const FALSY_PARAM_VALUE = '0';
export const TRUTHY_PARAM_VALUE = '1';

export const DEFAULT_AUTOPLAY_VALUE = FALSY_PARAM_VALUE;
export const DEFAULT_LOOP_VALUE = FALSY_PARAM_VALUE;
export const DEFAULT_CONTROLS_VALUE = TRUTHY_PARAM_VALUE;
export const DEFAULT_AUTOPAUSE_VALUE = FALSY_PARAM_VALUE;
export const DEFAULT_PLAYLIST_VALUE = '';
export const DEFAULT_MUTE_VALUE = FALSY_PARAM_VALUE;
export const DEFAULT_PLAYSINLINE_VALUE = TRUTHY_PARAM_VALUE;

export const DEFAULT_URL = 'https://www.youtube.com/embed/c8aFcHFu8QM';
export const DEFAULT_PROVIDER = PROVIDERS.YOUTUBE;

export const URL_PARAMS = {
	AUTOPLAY: 'autoplay',
	LOOP: 'loop',
	CONTROLS: 'controls',
	AUTOPAUSE: 'autopause',
	PLAYLIST: 'playlist',
	PLAYSINLINE: 'playsinline',
	MUTE: {
		[PROVIDERS.YOUTUBE]: 'mute',
		[PROVIDERS.VIMEO]: 'muted',
	},
};

export const PROVIDERS_BASE_URLS = {
	[PROVIDERS.YOUTUBE]: 'https://www.youtube.com/embed/',
	[PROVIDERS.VIMEO]: 'https://player.vimeo.com/video/',
};

export const URL_REG_EXP = {
	[PROVIDERS.YOUTUBE]: /^.*(?:youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|&vi?=)([^#&?]{11}).*/,
	[PROVIDERS.VIMEO]: /https:\/\/(?:vimeo.com|player.vimeo.com)\/(?:video\/)?(\d*)(.*)/,
};

export const VIMEO_OEMBED_API = 'https://vimeo.com/api/oembed.json?url=https://vimeo.com';
