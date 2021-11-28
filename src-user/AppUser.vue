<template>
	<div id="app">
		<Meta v-if="website" />
		<RouterView />
		<MobileObserver @toggle-mobile="updateIsMobileScreen" />
		<Lightbox v-if="isLightboxOpen" />
	</div>
</template>

<script>
import {
	mapState,
	mapActions,
} from 'vuex';

import { initUserAppWebsiteData } from '@site-modules/utils/initUserAppWebsiteData';
import Meta from '@user/components/metas/Meta.vue';
import {
	mapActionsGui,
	UPDATE_IS_MOBILE_SCREEN,
} from '@user/store/gui';

import Lightbox from '@/components/reusable-components/lightbox/Lightbox.vue';
import { useLightbox } from '@/components/reusable-components/lightbox/useLightbox';
import MobileObserver from '@/components/ui/MobileObserver.vue';

export default {
	components: {
		Lightbox,
		Meta,
		MobileObserver,
	},
	setup() {
		const { isLightboxOpen } = useLightbox();

		return {
			isLightboxOpen,
		};
	},
	computed: {
		...mapState(['website']),
	},
	async created() {
		await this.initUserApp();

		initUserAppWebsiteData(this.website);
	},
	beforeCreate() {
		// if image is already loaded via lazysizes (has 'srcset'), prevent unveiling
		// this happens for some images which are visible during prerendering
		document.addEventListener('lazybeforeunveil', (e) => {
			const { srcset } = e.target;

			if (srcset) {
				e.preventDefault();
			}
		});
	},
	methods: {
		...mapActions(['initUserApp']),
		...mapActionsGui({
			updateIsMobileScreen: UPDATE_IS_MOBILE_SCREEN,
		}),
	},
};
</script>
