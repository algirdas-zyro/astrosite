
import {
  NAVIGATION_PAGE_TYPE,
  NAVIGATION_LINK_TYPE,
  NAVIGATION_FOLDER_TYPE,
} from '../constants';
import { objectToCSSVariables } from '../use/useSiteStyles';

import {
  getOptimizedSrc,
  getGridItemSrcset,
  getGridItemSizes,
} from '../utils/getSrcsets';
import {
  getGridItemSize,
} from '../utils/getGridItemSize';


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

const getGridTextBoxProps = (element) => {
  const { settings } = element;
  const { styles } = settings;

  return {
    type: element.type,
    style: getStyle(styles),
    props: {
      content: element.content,
    }
  };
};

const getGridImageProps = (element, block) => {
  const { settings } = element;
  const {
    styles,
    alt,
    href,
    target,
    rel,
  } = settings;

  const { width, height } = getGridItemSize(block, styles.position);
  const tagName = settings.clickAction === 'link' ? 'a' : 'div';

  // Open link in new tab if it is preview mode and the link is external
  const src = getOptimizedSrc(settings.image, {
    width,
    height,
    shouldContain: styles['object-fit'] === 'contain',
  });

  const srcset = getGridItemSrcset(settings.image, {
    width,
    height,
    shouldContain: styles['object-fit'] === 'contain',
  });

  const sizes = getGridItemSizes(width);

  return {
    type: element.type,
    style: getStyle(styles),
    props: {
      alt,
      href,
      rel,
      sizes,
      src,
      srcset,
      tagName,
      target,
      width,
      height,
    }
  };
};

export const mapPageProps = (pageId, page, siteData) => {
  const { meta, styles } = siteData;
  const { homePageId, customMeta } = meta;
  const isHomePage = pageId === homePageId;
  const headerProps = getHeaderProps(page, siteData, homePageId);

  const blocks = page.blocks.map((blockId) => {
    const block = siteData.blocks[blockId];

    const elements = block.components
      .filter(({ hidden }) => !hidden)
      .map((elementId) => {
        const element = siteData.components[elementId];
        switch (element.type) {
          case 'GridTextBox': return getGridTextBoxProps(element);
          case 'GridImage': return getGridImageProps(element, block);
          default: return element;
        }
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
        blocks,
        headerProps,
        globalStyle: getStyle(styles),
        ...(isHomePage && { isHomePage: true }),
        ...(customMeta && { customMeta })
      },
    },
  };
};
