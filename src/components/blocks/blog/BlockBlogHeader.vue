<template>
	<div
		v-qa="'blog-postinformation'"
		class="block-blog-header"
	>
		<div class="block-blog-header__content">
			<h1
				v-qa="'blog-label-posttitle'"
				class="font-primary block-blog-header__title block-blog-header__text-block"
			>
				{{ meta.title }}
			</h1>
			<p
				v-if="shownItems.description"
				v-qa="'blog-label-postdescription'"
				class="font-secondary block-blog-header__text-block"
			>
				{{ meta.description }}
			</p>
			<BlockBlogListItemCategories
				v-if="areCategoriesShown"
				v-qa="'blog-label-category'"
				class="font-secondary"
				:categories="categories"
			/>
			<BlockBlogListItemMeta
				class="block-blog-header__meta"
				v-bind="{
					authorName,
					minutesAmount: customData.minutesToRead,
					date: $options.getFormattedNumericDate(customData.date),
					showAvatar: shownItems.avatar,
					showName: shownItems.authorFullName,
					showDate: shownItems.date,
					showMinutes: shownItems.minutesToRead
				}"
			/>
		</div>
	</div>
</template>

<script>

// import {
// 	mapState,
// 	mapGetters,
// } from 'vuex';

import BlockBlogListItemCategories from '../../../components/blocks/blog/BlockBlogListItemCategories.vue';
import BlockBlogListItemMeta from '../../../components/blocks/blog/BlockBlogListItemMeta.vue';

import { getFormattedNumericDate } from '../../../utils/date';

export default {
	name: 'BlokBlogHeader',
	components: {
		BlockBlogListItemMeta,
		BlockBlogListItemCategories,
	},
	props: {
		data: {
			type: Object,
			required: true,
		},
	},
	computed: {
		...mapState('user', ['user']),
		...mapGetters('pages', ['blogPages']),
		currentPage() {
			// TODO: refactor so that just relevant props would be provided explicitly. It's such a simple render component.
			// While editing post in builder the route param is page ID (.../postId)
			// While viewing post in user-app the route param is page PATH (.../pagePath)
			// There are never both, so we get current page id with this odd logic bellow:
			const {
				slug, // user-app
				postId, // builder
			} = this.$route.params;

			return Object.entries(this.blogPages).find(([id, blog]) => blog.slug === slug || id === postId)?.[1];
		},
		authorName() {
			return this.user?.fullName;
		},
		settings() {
			return this.data?.settings ?? {};
		},
		shownItems() {
			return this.settings?.shownItems ?? {};
		},
		meta() {
			return this.currentPage?.meta ?? {};
		},
		customData() {
			return this.currentPage?.customData ?? {};
		},
		categories() {
			return this.customData?.categories ?? [];
		},
		areCategoriesShown() {
			return this.shownItems.categories && this.categories.length;
		},
	},
	getFormattedNumericDate,
};
</script>

<style lang="scss" scoped>
@import '../../../components/blocks/blog/BlockBlogFonts.scss';

.block-blog-header {
	z-index: z-index(user--block-grid);
	display: flex;
	flex-direction: column;
	grid-area: 1/1/-1/-1;
	align-items: var(--align);
	width: 100%;
	max-width: var(--content-width);
	padding: var(--block-padding);
	margin: auto;
	text-align: var(--text-align);

	&__content {
		width: 100%;
	}

	&__meta {
		align-content: flex-start;
	}

	&__text-block {
		margin-bottom: 12px;
	}

	&__title {
		font-size: 32px;
	}
}

@include zyro-media($media-grid) {
	.block-blog-header {
		padding: var(--m-block-padding);
	}
}
</style>
