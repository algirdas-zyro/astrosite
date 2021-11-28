<template>
	<Integrations />
</template>

<script>
import {
	mapState,
	mapGetters,
} from 'vuex';

import { getFeaturesToPreconnectByPage } from '@site-modules/utils/getFeaturesToPreconnectByPage';
import { isAppPrerendering } from '@site-modules/utils/isAppPrerendering';
import Integrations from '@user/components/metas/integrations/Integrations.vue';

import {
	OG_TWITTER_CARD,
	OG_TWITTER_TITLE,
	OG_TWITTER_DESCRIPTION,
	OG_TWITTER_SUMMARY_LARGE_IMAGE,
	OG_TWITTER_IMAGE_ALT,
	OG_TWITTER_IMAGE,
	OG_IMAGE,
	OG_IMAGE_ALT,
	OG_TITLE,
	OG_SITE_NAME,
	OG_DESCRIPTION,
	DESCRIPTION,
	OG_TYPE,
	OG_TYPE_WEBSITE,
	OG_URL,
	DEFAULT_FAVICON,
	DEFAULT_DESCRIPTION,
	PRECONNECT_ECWID,
	PRECONNECT_YOUTUBE,
	PRECONNECT_VIMEO,
	PRECONNECT_MAP,
	PRECONNECT_INSTAGRAM,
	META_VALUE_NOINDEX,
	META_PROPERTY_ROBOTS,
} from './constants';

import {
	META_TAG,
	LINK_TAG,
	STYLE_TAG,
} from '@/constants/sanitizeConfig';
import { getCustomElements } from '@/utils/injectCustomScripts';

const SECOND_LEVEL_DOMAINS = [
	'co.uk',
	'com.au',
	'co.nz',
	'co.jp',
];
const assetsPreconnect = process.env.VUE_APP_ASSETS_PRECONNECT;

export default {
	components: {
		Integrations,
	},
	computed: {
		...mapState([
			'website',
			'domain',
		]),
		...mapGetters(['siteMeta']),
		ogImageHref() {
			const blogPostCoverImage = Object.values(this.website.pages).find(
				(page) => page.slug === this.$route.params.slug,
			)?.customData?.coverImage?.src;

			return blogPostCoverImage || this.siteMeta.ogImage;
		},
		faviconHref() {
			return this.siteMeta.favicon || DEFAULT_FAVICON;
		},
		imageMetas() {
			return this.ogImageHref ? [
				{
					vmid: OG_IMAGE,
					property: OG_IMAGE,
					content: this.ogImageHref,
				},
				{
					vmid: OG_TWITTER_IMAGE,
					property: OG_TWITTER_IMAGE,
					content: this.ogImageHref,
				},
				{
					vmid: OG_IMAGE_ALT,
					property: OG_IMAGE_ALT,
					content: 'Open graph preview image',
				},
				{
					// twitter:image:alt should be always last as it breaks other metas on iMessage
					vmid: OG_TWITTER_IMAGE_ALT,
					property: OG_TWITTER_IMAGE_ALT,
					content: 'Open graph preview image',
				},
			] : [];
		},
		siteUrl() {
			if (!this.domain) {
				return '';
			}

			// www. should be prepended to top level domains only
			const subDomainMargin = SECOND_LEVEL_DOMAINS.some((domain) => this.domain.includes(domain)) ? 3 : 2;
			const hasSubdomain = this.domain.split('.').length > subDomainMargin;

			return `https://${!hasSubdomain ? `www.${this.domain}` : this.domain}`;
		},
		customMeta() {
			return getCustomElements({
				customScripts: this.siteMeta.customMeta,
				tagName: META_TAG,
			});
		},
		customLinks() {
			return getCustomElements({
				customScripts: this.siteMeta.customMeta,
				tagName: LINK_TAG,
			});
		},
		customStyles() {
			return getCustomElements({
				customScripts: this.siteMeta.customMeta,
				tagName: STYLE_TAG,
			});
		},
		// If site is accessed via generated domain with custom domain available, add noindex meta so Google would not index it
		// We return empty tag if site is being prerendered - because the origin will never match with the domain.
		// Google first renders the page and only then indexes it, so it doesn't hurt us.
		noIndexMetaOnGeneratedDomain() {
			if (!this.domain) {
				return [];
			}

			// This one is needed as we have old domains saved in database with www
			const domainWithoutWww = this.domain.startsWith('www.') ? this.domain.slice(4) : this.domain;

			return (isAppPrerendering || window.origin.includes(domainWithoutWww) ? [] : [
				{
					vmid: `onGeneratedDomain-${META_PROPERTY_ROBOTS}-${META_VALUE_NOINDEX}`,
					name: META_PROPERTY_ROBOTS,
					content: META_VALUE_NOINDEX,
				},
			]);
		},
	},
	metaInfo() {
		const {
			path,
			params,
		} = this.$route;
		const { slug } = params;

		const {
			pages,
			meta,
		} = this.website;

		const isHomepage = path === '/' || slug === pages[meta.homePageId].slug;

		const currentPage = isHomepage ? pages[meta.homePageId]
			: Object.values(pages).find((page) => slug === page.slug);
		const sitePageUrl = `${this.siteUrl}/${isHomepage ? '' : slug}`;

		const title = currentPage?.meta?.title ?? currentPage?.name ?? pages[meta.homePageId].name;
		const description = currentPage?.meta?.description ?? DEFAULT_DESCRIPTION;
		const noindex = currentPage?.meta?.noindex ? META_VALUE_NOINDEX : false;

		const noindexMeta = !!noindex && this.noIndexMetaOnGeneratedDomain.length === 0 ? [
			{
				vmid: `${META_PROPERTY_ROBOTS}-${META_VALUE_NOINDEX}`,
				name: META_PROPERTY_ROBOTS,
				content: META_VALUE_NOINDEX,
			},
		] : [];

		return {
			title,
			meta: [
				{
					vmid: OG_TITLE,
					property: OG_TITLE,
					content: title,
				},
				{
					vmid: OG_SITE_NAME,
					property: OG_SITE_NAME,
					content: title,
				},
				{
					vmid: OG_TWITTER_TITLE,
					property: OG_TWITTER_TITLE,
					content: title,
				},
				{
					vmid: DESCRIPTION,
					name: DESCRIPTION,
					content: description,
				},
				{
					vmid: OG_DESCRIPTION,
					property: OG_DESCRIPTION,
					content: description,
				},
				{
					vmid: OG_TWITTER_DESCRIPTION,
					property: OG_TWITTER_DESCRIPTION,
					content: description,
				},
				{
					vmid: OG_TYPE,
					property: OG_TYPE,
					content: OG_TYPE_WEBSITE,
				},
				{
					vmid: OG_URL,
					property: OG_URL,
					content: sitePageUrl,
				},
				{
					vmid: OG_TWITTER_CARD,
					property: OG_TWITTER_CARD,
					content: OG_TWITTER_SUMMARY_LARGE_IMAGE,
				},
				...this.imageMetas,
				...this.customMeta,
				...this.noIndexMetaOnGeneratedDomain,
				...noindexMeta,
			],
			link: [
				{
					rel: 'icon',
					href: this.faviconHref,
				},
				{
					rel: 'apple-touch-icon',
					href: this.faviconHref,
				},
				{
					rel: 'canonical',
					href: sitePageUrl,
				},
				...this.customLinks,
				...(isAppPrerendering ? this.getPreconnectLinksArray() : []),
			],
			style: [...this.customStyles],
		};
	},
	methods: {
		getPreconnectLinksArray() {
			try {
				const {
					hasEcwid,
					hasYoutube,
					hasVimeo,
					hasMap,
					hasInstagram,
				} = getFeaturesToPreconnectByPage(this.website, this.$route.path);

				return [
					...(assetsPreconnect ? [assetsPreconnect] : []),
					...(hasEcwid ? PRECONNECT_ECWID : []),
					...(hasYoutube ? PRECONNECT_YOUTUBE : []),
					...(hasVimeo ? PRECONNECT_VIMEO : []),
					...(hasMap ? PRECONNECT_MAP : []),
					...(hasInstagram ? PRECONNECT_INSTAGRAM : []),
				].map((href) => ({
					rel: 'preconnect',
					href,
				}));
			} catch (error) {
				console.error(error);

				return [];
			}
		},
	},
};
</script>
