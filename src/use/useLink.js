import {
	getCurrentInstance,
	computed,
} from 'vue-demi';

import { TARGET_BLANK } from '../constants';
import { scrollToSection } from '../utils/scrollToSection';

export const useLink = () => {
	const {
		$store,
		$router,
	} = getCurrentInstance()?.proxy ?? {};

	const pagesPaths = computed(() => Object.values($store.state.website.pages).map(({ slug }) => `/${slug}`));

	const linkClickHandler = (event) => {
		const closestAnchor = event.target.closest('a');

		if (!closestAnchor) {
			return;
		}

		const {
			href,
			hash,
			pathname,
			target,
			origin,
		} = closestAnchor;

		// `href` from anchor always returns the href with origin included.
		// So, if anchor has 'href="/path"', `href` will be `site.com/path`
		// While `href` and an attribute always returns the original value, with nothing added or removed
		const originalHref = closestAnchor.getAttribute('href');

		const isSameOrigin = origin === window.location.origin;
		const pathnameWithHashAndQuery = href.replace(origin, '');
		const isValidSitePagePath = pagesPaths.value.includes(pathname) || pathname === '/' || pathname.startsWith('/#');
		const isLinkToSitePage = isSameOrigin && isValidSitePagePath;
		const isTargetBlank = target === TARGET_BLANK;
		const isLinkToSection = !!hash;
		// We have to check if originalHref includes origin so we would open that page not with the vue-router,
		// but with native browser (including page reload)
		// So, `href="/path"` gets opened with vue-router, while `href="mysite.com/path"` gets opened natively
		// (this is needed when users set a full URL on a link so Ecwid would be able catch the change of the URL)
		const isFullLink = originalHref.includes(window.location.origin);

		// All internal links, that are not opened in a new tab, are handled with vue-router
		if (isLinkToSitePage && !isTargetBlank && !isFullLink) {
			event.preventDefault();

			if (href !== window.location.href) {
				// Prevent duplicated navigation.
				$router.push(pathnameWithHashAndQuery);
			} else if (!isLinkToSection) {
				// If the path is the same and there is no link to section - user is trying to navigate to the same page he already is in.
				// In this case, we just scroll to top.
				window.scrollTo(0, 0);
			} else {
				// If same anchor is clicked for second time, use scrollToSection to scroll (this is needed only because of vue-router bug - https://github.com/vuejs/vue-router/issues/1668)
				scrollToSection(hash);
			}
		}
	};

	return {
		linkClickHandler,
	};
};
