export const GRID_BREAKPOINT = 920;

export const QA_DIRECTIVE_NAME = 'qa';

export const NAVIGATION_LINK_TYPE = 'Link';
export const NAVIGATION_PAGE_TYPE = 'Page';
export const NAVIGATION_FOLDER_TYPE = 'Folder';
export const NAVIGATION_HOMEPAGE_TYPE = 'Homepage';

export const NAVIGATION_GROUP_ROOT = 'ROOT';
export const NAVIGATION_GROUP_HIDDEN = 'HIDDEN';
export const STATIC_ASSETS_BASE_PATH = 'https://static.zyro.com';

export const BLOCK_HEADER_CLASS = 'block-header';
export const BLOCK_HEADER_STICKY_CLASS = 'block-header--is-sticky';

export const NAVIGATION_LOGO_SPACING_MAP = {
	center: '0 var(--space-between-menu)',
	left: '0 var(--space-between-menu) 0 0',
	right: '0 0 0 var(--space-between-menu)',
	'center-center': '0 0 var(--space-between-menu) 0',
};

export const NAVIGATION_LOGO_MENU_POSITION_MAP = {
	// LogoPosition-NavigationPosition
	'left-left': {
		logoRow: 1,
		menuRow: 1,
		cartRow: 1,
		logoColumn: '1/2',
		menuColumn: '2/3',
		cartColumn: '3/3',
		templateColumns: 'minmax(calc(var(--logo-width) + var(--space-between-menu)), auto) 1fr',
		mTemplateColumns: 'minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), auto) 1fr',
	},
	'left-right': {
		logoRow: 1,
		menuRow: 1,
		cartRow: 1,
		logoColumn: '1/2',
		menuColumn: '2/3',
		cartColumn: '3/3',
		templateColumns: 'minmax(calc(var(--logo-width) + var(--space-between-menu)), auto) 1fr',
		mTemplateColumns: 'minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), auto) 1fr',
	},
	'left-center': {
		logoRow: 1,
		menuRow: 1,
		cartRow: 1,
		logoColumn: '1/2',
		menuColumn: '2/3',
		cartColumn: '3/3',
		templateColumns: 'minmax(calc(var(--logo-width) + var(--space-between-menu)), 1fr) auto 1fr',
		mTemplateColumns: 'minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), 1fr) auto 1fr',
	},
	'center-left': {
		logoRow: 1,
		menuRow: 1,
		cartRow: 1,
		logoColumn: '2/3',
		menuColumn: '1/2',
		cartColumn: '3/4',
		templateColumns: '1fr minmax(calc(var(--logo-width) + var(--space-between-menu)), auto) 1fr',
		mTemplateColumns: '1fr minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), auto) 1fr',
	},
	'center-right': {
		logoRow: 1,
		menuRow: 1,
		cartRow: 1,
		logoColumn: '2/3',
		menuColumn: '3/4',
		cartColumn: '4/4',
		templateColumns: '1fr minmax(calc(var(--logo-width) + var(--space-between-menu)), auto) 1fr',
		mTemplateColumns: '1fr minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), auto) 1fr',
	},
	'center-center': {
		logoRow: 0,
		menuRow: 2,
		cartRow: 1,
		logoColumn: '2/3',
		menuColumn: '1/4',
		cartColumn: '3/3',
		templateColumns: '1fr minmax(var(--logo-width), auto) 1fr',
		mTemplateColumns: '1fr minmax((--m-logo-width, var(--logo-width)), auto) 1fr',
	},
	'right-left': {
		logoRow: 1,
		menuRow: 1,
		cartRow: 1,
		logoColumn: '2/3',
		menuColumn: '1/2',
		cartColumn: '3/3',
		templateColumns: '1fr minmax(calc(var(--logo-width) + var(--space-between-menu)), auto)',
		mTemplateColumns: '1fr minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), auto)',
	},
	'right-right': {
		logoRow: 1,
		menuRow: 1,
		cartRow: 1,
		logoColumn: '2/3',
		menuColumn: '1/2',
		cartColumn: '3/3',
		templateColumns: '1fr minmax(calc(var(--logo-width) + var(--space-between-menu)), auto)',
		mTemplateColumns: '1fr minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), auto)',
	},
	'right-center': {
		logoRow: 1,
		menuRow: 1,
		cartRow: 1,
		logoColumn: '3/4',
		menuColumn: '2/3',
		cartColumn: '4/4',
		templateColumns: '1fr auto minmax(calc(var(--logo-width) + var(--space-between-menu)), 1fr)',
		mTemplateColumns: '1fr auto minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), 1fr)',
	},
};

export const NAVIGATION_JUSTIFY_CONTENT_MAP = {
	left: 'flex-start',
	right: 'flex-end',
	center: 'center',
	default: 'center',
};

export const NAVIGATION_LOGO_IMAGE_OBJECT_POSITION_MAP = {
	left: 'left center',
	right: 'right center',
	center: 'center center',
	default: 'left center',
};

export const TARGET_SELF = '_self';
export const TARGET_BLANK = '_blank';
export const REL_NOFOLLOW = 'nofollow';
export const ANCHOR_TAG = 'a';
export const DIV_TAG = 'div';

export const IMAGE_CLICK_ACTION_LIGHTBOX = 'lightbox';
export const IMAGE_CLICK_ACTION_LINK = 'link';
export const IMAGE_CLICK_ACTION_NONE = 'none';

export const BLOCK_MODIFIERS_MAP = {
	BlockEcwidStore: 'ecwid-store',
	BlockBlogHeader: 'blog-header',
	BlockBlogList: 'blog-list',
	BlockSlideshow: 'slideshow',
	default: 'grid',
};
