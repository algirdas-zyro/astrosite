
import {
	NAVIGATION_PAGE_TYPE,
	NAVIGATION_LINK_TYPE,
	NAVIGATION_FOLDER_TYPE,
} from '../constants';
import { objectToCSSVariables } from '../use/useSiteStyles';


const concatStyles = (object) => Object.entries(object).map(([key, value]) => `${key}:${value};`).join('');
const getStyle = (style) => concatStyles(objectToCSSVariables(style));

const mapNavItem = (itemId, pages, items, homePageId, slug) => {
	const item = items[itemId];
	const page = pages[itemId];

	const {
		name,
		type,
		target,
		url,
	} = item;
	const isPage = type === NAVIGATION_PAGE_TYPE;
	const isLink = type === NAVIGATION_LINK_TYPE;
	const isFolder = type === NAVIGATION_FOLDER_TYPE;
	const isHomePage = itemId === homePageId;
	const navItemSlug = page?.slug;

	return {
		...item,
		name: isPage ? page?.name : name,
		url: isHomePage ? '/' : (navItemSlug && `/${navItemSlug}`) || url,
		id: itemId,
		isPage,
		isLink,
		isFolder,
		hasDropdown: !!item.subItems.length || item.isFolder,
		target,
		isCurrent: slug === navItemSlug || isHomePage,
		subItems: item.subItems.map((id) => mapNavItem(id, pages, items, homePageId, slug)),
	};
};

const getHeaderProps = (page, siteData, homePageId) => {
	const { navigation, pages } = siteData;
	const { settings, background } = siteData.blocks.navigation;
	const { styles } = settings;

	const items = siteData.navigation.itemsIds.map((id) => mapNavItem(id, pages, navigation.items, homePageId, page.slug));

	return {
		items,
		isCartVisible: settings.isCartVisible && 'isSiteWithEcwid' && false,
        itemsInCart: 'ecwidCartItemCount' && 0,
		isLogoVisible: settings.showLogo,
		logoUrl: settings.logoUrl,
        cartText: settings.cartText,
        cartIconSize: styles.cartIconSize,
        logoPlacement: settings.logoPlacement,
        logoPlacementMobile: settings['m-logoPlacement'] || settings.logoPlacement,
        navigationPlacement: settings.navigationPlacement,
        navigationPlacementMobile: settings['m-navigationPlacement'] || settings.navigationPlacement,
        isSticky: settings.isSticky,
        logoMaxWidth: styles['logo-width'],
        logoMaxWidthMobile: styles['m-logo-width'],
        logoHeight: styles['logo-height'],
        logoHeightMobile: styles['m-logo-height'],
        logoObjectPosition: styles['logo-image-object-position'],
        logoObjectPositionMobile: styles['m-logo-image-object-position'],
        background: background,
        isTransparent: background.isTransparent,
        backgroundColor: background.color,
		isLogoOptimized: false,
		style: getStyle(styles),
	}
}


export const mapPageProps = (pageId, page, siteData) => {
	const { meta, styles } = siteData;
	const { homePageId } = meta;
	const isHomePage = pageId === homePageId;
	const headerProps = getHeaderProps(page, siteData, homePageId);

	const blocks = page.blocks.map((blockId) => {
		const block = siteData.blocks[blockId];

		const elements = block.components
			.filter(({ hidden }) => !hidden)
			.map((elementId) => {
				const element = siteData.components[elementId];
				return {
					id: elementId,
					...element,
				};
			});

		return {
			id: blockId,
			...block,
			elements,
		};
	});

	return {
		params: {
			slug: page.slug,
		},
		props: {
			page: {
				...page,
				blocks: blocks,
				headerProps,
				globalStyle: getStyle(styles),
				...(isHomePage && { isHomePage: true })
			},
		},
	};
};
