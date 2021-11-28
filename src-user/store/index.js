import Vue from 'vue';
import Vuex from 'vuex';

import { initUserAppWebsiteData } from '@site-modules/utils/initUserAppWebsiteData';
import {
	overrideAnchorClicks,
	previewModeClickHandler,
} from '@site-modules/utils/overrideAnchorClicks';
import router from '@user/routerUser';

import blog from './blog';
import ecommerce from './ecommerce';
import gui from './gui';
import navigation from './navigation';
import pages from './pages';
import user from './user';

import {
	getLocalDevelopmentTemplate,
	getLocalDevelopmentTemplateName,
} from '@/utils/localDevelopment';

Vue.use(Vuex);

export const deleteHiddenPages = (websitePages, currentDate) => Object.fromEntries(
	Object.entries(websitePages).map(([key, value]) => {
		if (!value.customData?.isScheduled) {
			return [
				key,
				value,
			];
		}

		const { customData } = value;

		const publishDate = new Date(customData.date).setHours(0, 0, 0, 0);
		const hasCurrentDateExceededPublishDate = publishDate <= currentDate;

		return [
			key,
			{
				...value,
				customData: {
					...customData,
					...(hasCurrentDateExceededPublishDate && {
					// TODO: pages should have 'status' - 'scheduled' or 'draft'
						hidden: false,
						isScheduled: false,
					}),
				},
			},
		];
	}).filter(((entry) => entry[1].customData?.hidden !== true)),
);

export const storeConfig = {
	modules: {
		navigation,
		user,
		blog,
		pages,
		gui,
		ecommerce,
	},
	state: {
		website: null,
		hasActivePlan: '',
		domain: '',
	},
	getters: {
		siteMeta: (state) => state.website?.meta ?? {},
		siteElements: (state) => state.website?.components ?? {}, // TODO: write a mapper to rename it to 'website.elements'
	},
	mutations: {
		setWebsite: (state, { website }) => {
			state.website = website;
			if (!state.website.meta.homePageId) {
				Vue.set(state.website.meta, 'homePageId', Object.keys(state.website.pages)[0]);
			}
		},
		setHasActivePlan: (state, hasActivePlan) => {
			state.hasActivePlan = !!hasActivePlan;
		},
		setDomain: (state, domain) => {
			state.domain = domain;
		},
	},
	actions: {
		initUserApp: async ({
			commit,
			dispatch,
		}) => {
			/**
			 * Listen for message events to allow setting data externally
			 * Used for previews
			 */
			window.addEventListener('message', ({ data }) => {
				if (typeof data !== 'object') {
					return;
				}

				const {
					path,
					websiteData,
					initUserPreview,
				} = data;

				if (initUserPreview) {
					initUserAppWebsiteData(websiteData);
					overrideAnchorClicks(previewModeClickHandler);
				}

				if (websiteData) {
					commit('setWebsite', {
						website: websiteData,
					});
				}

				if (data.user) {
					commit('user/setUser', data.user);
				}

				if (path && path !== router.currentRoute.path) {
					router.push({
						path,
					});
				}
			});

			try {
				// User-app setup
				let websiteData;

				if (process.env.NODE_ENV === 'development') {
					// Local development setup
					// Open any template from DB using http://localhost:4002?template={templateID}
					const templateName = getLocalDevelopmentTemplateName() || 'local';

					websiteData = (await getLocalDevelopmentTemplate(templateName)).data;
				} else if (window.location.href.includes(process.env.VUE_APP_PREVIEW_URL)) {
					// do not fetch template data if the app is loaded in iframe preview
					return;
				} else if (window.prefetchedWebsite && typeof window.prefetchedWebsite === 'string') {
					// Prod setup
					// Checking if prefetchedWebsite exists on prerendered html
					websiteData = JSON.parse(window.prefetchedWebsite);
				} else {
					// Prod setup
					// Fetch data from file in root
					websiteData = await fetch('data.json').then((response) => response.json());
				}

				const currentDate = new Date().setHours(0, 0, 0, 0);

				websiteData.pages = deleteHiddenPages(websiteData.pages, currentDate);

				commit('setHasActivePlan', websiteData.hasActivePlan);
				commit('user/setUser', websiteData.user);
				commit('setWebsite', {
					website: websiteData,
				});
				dispatch('setDomain', websiteData.domain);
			} catch (error) {
				console.error(error);
				// TODO: Proper error handling
			} finally {
				// User app has initialised, ready for messages. (handler above)
				window.parent.postMessage('readyForMessages', '*');
			}
		},
		setDomain: ({ commit }, domain) => commit('setDomain', domain),
	},
};
export default new Vuex.Store(storeConfig);
