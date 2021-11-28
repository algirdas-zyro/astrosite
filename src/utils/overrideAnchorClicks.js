import { TARGET_BLANK } from '../constants';

export const previewModeClickHandler = (event) => {
	const closestAnchor = event.target.closest('a');

	if (!closestAnchor) {
		return;
	}

	const {
		href,
		origin,
		target,
		pathname,
	} = closestAnchor;

	const isSameOrigin = origin === window.location.origin;
	const isTargetBlank = target === TARGET_BLANK;
	const isInternalLink = pathname?.[0] === '/' && pathname?.[1] !== '/';

	// If origins do not match - it is an external link, which should be opened in a new tab.
	// If origins to match, but has blank target - it's an internal page. Ignore the click.
	if (!isSameOrigin && href) {
		event.preventDefault();
		window.open(href, TARGET_BLANK);
	} else if (isTargetBlank || isInternalLink) {
		event.preventDefault();
	}
};

export const overrideAnchorClicks = (overriddenClickHandler) => {
	// First remove event listener if it was initiated earlier
	window.removeEventListener('click', overriddenClickHandler);
	window.addEventListener('click', overriddenClickHandler);
};
