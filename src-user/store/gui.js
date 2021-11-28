import { createNamespacedHelpers } from 'vuex';

import { GRID_BREAKPOINT } from '@site-modules/constants';

// namespacing to use with `createNamespacedHelpers`
export const GUI_NAMESPACE = 'gui';

// action type constants:
export const UPDATE_IS_MOBILE_SCREEN = 'UPDATE_IS_MOBILE_SCREEN';

// mutation type constants:
export const SET_IS_MOBILE_SCREEN = 'SET_IS_MOBILE_SCREEN';

export const { mapActions: mapActionsGui } = createNamespacedHelpers(GUI_NAMESPACE);

export default {
	namespaced: true,
	state: {
		isMobileScreen: window.innerWidth < GRID_BREAKPOINT,
		isMobileView: null, // TODO: https://github.com/zyro-inc/zyro/issues/1841
	},
	mutations: {
		[SET_IS_MOBILE_SCREEN]: (state, isMobileScreen) => {
			state.isMobileScreen = isMobileScreen;
		},
	},
	actions: {
		[UPDATE_IS_MOBILE_SCREEN]: ({ commit }, isMobile) => commit(SET_IS_MOBILE_SCREEN, isMobile),
	},
};
