import Router from 'vue-router';

import {
	BLOCK_HEADER_CLASS,
	BLOCK_HEADER_STICKY_CLASS,
} from '@site-modules/constants';
import Page from '@user/components/Page.vue';

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			component: Page,
		},
		{
			path: '/:slug',
			component: Page,
		},
	],
	// If there is a saved already position - use it.
	// If no hash is provided - scroll to top
	// If hash is provided - scroll to the section (and account for header height)
	scrollBehavior: (to, from, savedPosition) => {
		if (savedPosition) {
			return savedPosition;
		}

		if (!to.hash) {
			return {
				x: 0,
				y: 0,
				behaviour: 'smooth',
			};
		}

		const headerHeight = document.querySelector(`.${BLOCK_HEADER_CLASS}`)?.offsetHeight;
		const isHeaderSticky = document.querySelector(`.${BLOCK_HEADER_STICKY_CLASS}`);

		return {
			selector: to.hash,
			offset: {
				y: isHeaderSticky ? headerHeight : 0,
				x: 0,
			},
			behaviour: 'smooth',
		};
	},
});

// Make google analytics pageview work with SinglePageApplications
// https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications
router.afterEach((to) => {
	if (window.gtag) {
		window.gtag('set', 'page_path', to.path);
		window.gtag('event', 'page_view');
	}
});

export default router;
