import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';
import VueCompositionApi from '@vue/composition-api';
import { FocusTrap } from 'focus-trap-vue';
import PortalVue from 'portal-vue';
import vClickOutside from 'v-click-outside';
import Vue from 'vue';
import VueMasonry from 'vue-masonry-css';
import VueMeta from 'vue-meta';
import Router from 'vue-router';
import 'lazysizes';

import '@user/assets/scss/global.scss';
import { QA_DIRECTIVE_NAME } from '@site-modules/constants';
import App from '@user/AppUser.vue';
import router from '@user/routerUser';
import store from '@user/store';

import Recomputable from '@/plugins/recomputable';

if ('ResizeObserver' in window === false) {
	window.ResizeObserver = ResizeObserverPolyfill;
}

Vue.use(VueMeta);
Vue.use(VueMasonry);
Vue.use(Recomputable);
Vue.use(VueCompositionApi);
Vue.use(vClickOutside);
Vue.use(PortalVue);
Vue.use(Router);
// add empty v-qa directive as some components use it.
Vue.directive(QA_DIRECTIVE_NAME, {});
Vue.component('FocusTrap', FocusTrap);
Vue.config.productionTip = false;

new Vue({
	store,
	mounted: () => document.dispatchEvent(new Event('x-app-rendered')),
	router,
	render: (h) => h(App),
}).$mount('#app');
