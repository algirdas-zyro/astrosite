import { PRERENDERING_FLAG } from '../utils/isAppPrerendering';

export const createLink = (href, rel, options) => {
	// prevent double-adding existing scripts
	if (document.querySelector(`link[href="${href}"][rel="${rel}"]`)) {
		return;
	}

	const link = document.createElement('link');

	link.setAttribute('href', href);
	link.setAttribute('rel', rel);

	Object.entries(options).forEach(([attr, value]) => link.setAttribute(attr, value));

	document.head.prepend(link);
};

export const addFontLinks = (href) => {
	createLink('https://fonts.gstatic.com', 'preconnect', {
		crossorigin: true,
	});
	createLink(href, 'preload', {
		as: 'style',
	});

	/**
	 * Only add media="print" stylesheet when there is no such styleseheet in the DOM.
	 * During prerender or during initial mount after publishing until prerender service hasn't kicked in yet.
	 */
	createLink(href, 'stylesheet', {
		media: 'print',
		onload: `if(!window.${PRERENDERING_FLAG})this.removeAttribute('media');`,
	});
};
