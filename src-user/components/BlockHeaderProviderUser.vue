<template>
	<BlockHeader
		:items="navigationItems"
		:is-open="isOpen"
		:is-logo-visible="settings.showLogo"
		:is-cart-visible="settings.isCartVisible && isSiteWithEcwid"
		:logo-url="settings.logoUrl"
		:cart-text="settings.cartText"
		:cart-icon-size="styles.cartIconSize"
		:items-in-cart="ecwidCartItemCount"
		:logo-placement="logoPlacement"
		:background="data.background"
		:is-sticky="settings.isSticky"
		:has-user-scrolled="hasUserScrolled"
		:height="height"
		:is-transparent="data.background.isTransparent"
		:logo-placement-mobile="logoPlacementMobile"
		:navigation-placement="navigationPlacement"
		:navigation-placement-mobile="navigationPlacementMobile"
		:logo-max-width="styles['logo-width']"
		:logo-max-width-mobile="styles['m-logo-width']"
		:logo-height="styles['logo-height']"
		:logo-height-mobile="styles['m-logo-height']"
		:logo-object-position="styles['logo-image-object-position']"
		:logo-object-position-mobile="styles['m-logo-image-object-position']"
		:background-color="data.background.color"
		:style="computedStyles"
		is-logo-optimized
		@logo-click="handleLogoClick"
		@cart-click="handleCartClick"
		@toggle-visibility="isOpen = !isOpen"
		@navigation-item-click="handleNavigationItemClick($event)"
		@update-height="$emit('update-height', $event)"
	/>
</template>

<script>

import {
	mapGetters,
	mapState,
} from 'vuex';

import BlockHeader from '@site-modules/components/blocks/header/BlockHeader.vue';
import {
	NAVIGATION_PAGE_TYPE,
	NAVIGATION_LINK_TYPE,
	NAVIGATION_FOLDER_TYPE,
} from '@site-modules/constants';
import { useEcwidStore } from '@site-modules/use/useEcwidStore';
import { useLink } from '@site-modules/use/useLink';

import { useInlineCSSVariables } from '@/use/useInlineCSSVariables';

export default {
	name: 'BlockHeaderProviderUser',
	components: {
		BlockHeader,
	},
	props: {
		data: {
			type: Object,
			required: true,
		},
		hasUserScrolled: {
			type: Boolean,
			default: false,
		},
		height: {
			type: Number,
			default: null,
		},
	},
	setup(props) {
		const {
			ecwidCartItemCount,
			openCart,
			openEcwidHomepage,
		} = useEcwidStore();
		const { linkClickHandler } = useLink();
		const { computedStyles } = useInlineCSSVariables(props);

		return {
			linkClickHandler,
			ecwidCartItemCount,
			openCart,
			openEcwidHomepage,
			computedStyles,
		};
	},
	data() {
		return {
			isOpen: false,
		};
	},
	computed: {
		...mapState(['website']),
		...mapState('gui', ['isMobileScreen']),
		...mapGetters('navigation', [
			'items',
			'itemsIds',
		]),
		...mapGetters(['siteMeta']),
		...mapGetters('pages', [
			'ecommercePages',
			'isHomepageWithEcwid',
		]),
		isSiteWithEcwid() {
			return Object.keys(this.ecommercePages).length > 0;
		},
		settings() {
			return this.data.settings;
		},
		styles() {
			return this.settings.styles;
		},
		navigationItems() {
			const mapItem = (itemId) => {
				const item = this.items[itemId];
				const { pages } = this.website;

				const {
					name,
					type,
					target,
					url,
				} = item;
				const isPage = type === NAVIGATION_PAGE_TYPE;
				const isLink = type === NAVIGATION_LINK_TYPE;
				const isFolder = type === NAVIGATION_FOLDER_TYPE;
				const isHomePage = pages[itemId]?.slug === pages[this.siteMeta.homePageId].slug;
				const slug = pages[itemId]?.slug;

				return {
					...item,
					name: isPage ? pages[itemId].name : name,
					url: isHomePage ? '/' : (slug && `/${slug}`) || url,
					id: itemId,
					isPage,
					isLink,
					isFolder,
					hasDropdown: !!item.subItems.length || item.isFolder,
					target,
					isCurrent: (this.$route.path === `/${slug}`) || (this.$route.path === '/' && isHomePage),
					subItems: item.subItems.map(mapItem),
				};
			};

			return this.itemsIds.map(mapItem);
		},
		// TODO: Rework after Layout presets iteration
		navigationPlacement() {
			return this.settings.navigationPlacement;
		},
		navigationPlacementMobile() {
			return this.settings['m-navigationPlacement'] || this.navigationPlacement;
		},
		logoPlacement() {
			return this.settings.logoPlacement;
		},
		logoPlacementMobile() {
			return this.settings['m-logoPlacement'] || this.logoPlacement;
		},
	},
	watch: {
		$route() {
			this.isOpen = false;
		},
	},
	methods: {
		handleCartClick() {
			const isCurrentPageEcommerce = Object.values(this.ecommercePages).some(({ slug }) => `/${slug}` === this.$route.path);

			if (isCurrentPageEcommerce) {
				this.openCart();
			} else if (this.$route.query?.['store-page'] !== 'cart') {
				const {
					slug,
					blocks,
				} = Object.values(this.ecommercePages)[0];
				const ecommerceBlockId = blocks.find((blockId) => this.website.blocks[blockId].type === 'BlockEcwidStore');

				this.$router.push({
					path: `/${slug}`,
					hash: ecommerceBlockId,
					query: {
						'store-page': 'cart',
					},
				});
			}
		},
		handleLogoClick() {
			if (this.$route.path !== '/') {
				this.$router.push('/');
			} else if (this.isHomepageWithEcwid) {
				this.openEcwidHomepage();
			} else {
				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				});
			}
		},
		handleNavigationItemClick({
			navigationItem,
			event,
			toggle,
		}) {
			if (navigationItem.isFolder && this.isMobileScreen) {
				toggle();

				return;
			}

			this.linkClickHandler(event);
			this.handleEcwidHomepageClick(navigationItem.id);
		},
		handleEcwidHomepageClick(pageId) {
			const isSelectedPageWithEcwid = Object.keys(this.ecommercePages).includes(pageId);

			if (window.Ecwid && isSelectedPageWithEcwid) {
				window.Ecwid.openPage('category');
			}
		},
	},
};
</script>
