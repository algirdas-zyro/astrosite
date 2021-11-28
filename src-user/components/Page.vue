<template>
	<main
		v-if="website"
		ref="pageRef"
		:style="siteCSSVariables"
	>
		<div
			ref="stickyTriggerRef"
			class="sticky-trigger"
		/>
		<BlockHeaderProviderUser
			v-if="!website.navigation.hidden"
			:data="website.blocks.navigation"
			:has-user-scrolled="hasUserScrolled"
			:height="headerHeight"
			@update-height="headerHeight = $event"
		/>
		<!-- Simple blocks -->
		<BlockUser
			v-for="(blockId, index) of allBlocks"
			:id="website.blocks[blockId].settings.htmlId || blockId"
			:key="blockId"
			:data="website.blocks[blockId]"
			:blocks="website.blocks"
			:components="website.components"
			:is-mobile-view="isMobileView"
			:style="index === 0 ? transparentBlockStyle : null"
		/>
		<CookieBanner v-if="siteMeta.isCookieBarEnabled" />
		<ModalRoot />
	</main>
</template>

<script>
import {
	mapState,
	mapGetters,
} from 'vuex';

import BlockHeaderProviderUser from '@user/components/BlockHeaderProviderUser.vue';
import CookieBanner from '@user/components/CookieBanner.vue';
import BlockUser from '@user/components/block/BlockUser.vue';
import ModalRoot from '@user/components/modals/ModalRoot.vue';

import { useSiteStyles } from '@/use/useSiteStyles';

export default {
	name: 'Page',
	components: {
		CookieBanner,
		BlockUser,
		BlockHeaderProviderUser,
		ModalRoot,

	},
	props: {
		isMobileView: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		const { siteCSSVariables } = useSiteStyles();

		return {
			siteCSSVariables,
		};
	},
	data() {
		return {
			stickyIntersectionObserver: null,
			hasUserScrolled: false,
			headerHeight: null,
		};
	},
	computed: {
		...mapState(['website']),
		...mapState(['user']),
		...mapGetters(['siteMeta']),
		currentPage() {
			if (this.$route.path === '/') {
				return this.website.pages[this.siteMeta.homePageId];
			}

			return Object.values(this.website.pages).find(({ slug }) => slug === this.$route.params.slug);
		},
		pageBlocksSlotFooter() {
			if (this.currentPage.footerSlotIsHidden) {
				return [];
			}

			const footerBlock = Object.keys(this.website.blocks)
				.find((blockId) => this.website.blocks[blockId].slot === 'footer');

			return footerBlock ? [footerBlock] : [];
		},
		allBlocks() {
			return [
				...this.currentPage.blocks,
				...this.pageBlocksSlotFooter,
			];
		},
		isPageWithEcwid() {
			return Object.values(this.currentPage.blocks).some((blockId) => this.website.blocks[blockId].type === 'BlockEcwidStore');
		},
		transparentBlockStyle() {
			const { isTransparent } = this.website.blocks.navigation.background;

			return {
				'--header-height': isTransparent ? `${this.headerHeight}px` : null,
			};
		},
	},
	watch: {
		async website(newValue, oldValue) {
			if (newValue && !oldValue) {
				await this.$nextTick();
				this.initObservers();
			}
		},
	},
	mounted() {
		this.initObservers();
	},
	beforeDestroy() {
		if (this.stickyIntersectionObserver) {
			this.stickyIntersectionObserver.disconnect();
		}
	},
	methods: {
		initObservers() {
			if (this.$refs.stickyTriggerRef && !this.stickyIntersectionObserver) {
				this.stickyIntersectionObserver = new IntersectionObserver(([{ isIntersecting }]) => {
					this.hasUserScrolled = !isIntersecting;
				}, {
					threshold: 1,
				});

				this.stickyIntersectionObserver.observe(this.$refs.stickyTriggerRef);
			}
		},
	},
};
</script>

<style lang="scss">
.sticky-trigger {
	position: relative;
	top: 0;
	z-index: -1;
	height: 1px;
	margin-bottom: -1px;
	pointer-events: none;
}
</style>
