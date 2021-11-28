<template>
	<div class="block-blog-list-item">
		<slot name="block-blog-list-item-overlay" />
		<div
			v-if="isCoverImageShown"
			class="block-blog-list-item__cover-image-container"
		>
			<div class="block-blog-list-item__cover-image-wrapper">
				<img
					v-qa="'blog-list-item-image'"
					class="block-blog-list-item__cover-image"
					:src="coverImage.src"
					:alt="coverImage.alt"
					@click="$emit('post-click')"
				>
			</div>
		</div>
		<BlockBlogListItemCategories
			v-show="shownItems.categories && categories.length"
			class="font-secondary"
			:categories="categories"
			@filter-category="(category) => $emit('filter-category', category)"
		/>
		<div
			class="block-blog-list-item__content"
			@click="$emit('post-click')"
		>
			<h3
				v-show="shownItems.title"
				class="block-blog-list-item__text font-primary"
			>
				<a
					class="block-blog-list-item__post-link"
					:href="post.path"
					@click.prevent="$emit('post-click')"
				>
					{{ post.meta.title }}
				</a>
			</h3>
			<p
				v-show="shownItems.description"
				class="block-blog-list-item__text font-secondary"
			>
				{{ post.meta.description }}
			</p>
			<BlockBlogListItemMeta
				v-bind="{
					authorName: authorFullName,
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
import BlockBlogListItemCategories from '../../../components/blocks/blog/BlockBlogListItemCategories.vue';
import BlockBlogListItemMeta from '../../../components/blocks/blog/BlockBlogListItemMeta.vue';

import { getFormattedNumericDate } from '../../../utils/date';

export default {
	components: {
		BlockBlogListItemMeta,
		BlockBlogListItemCategories,
	},
	props: {
		post: {
			type: Object,
			default: () => ({}),
		},
		authorFullName: {
			type: String,
			default: null,
		},
		shownItems: {
			type: Object,
			default: () => ({
				authorFullName: true,
				coverImage: true,
				title: true,
				description: true,
				date: true,
				categories: true,
				avatar: true,
				minutesToRead: true,
			}),
		},
		coverObjectFit: {
			type: String,
			default: 'cover',
		},
		cursor: {
			type: String,
			default: 'pointer',
		},
	},
	computed: {
		customData() {
			return this.post?.customData ?? {};
		},
		coverImage() {
			return this.customData?.coverImage ?? {};
		},
		categories() {
			return this.customData?.categories ?? [];
		},
		isCoverImageShown() {
			return !!this.shownItems.coverImage && this.coverImage.src;
		},
	},
	getFormattedNumericDate,
};
</script>

<style lang="scss" scoped>
@import '../../../components/blocks/blog/BlockBlogFonts.scss';

.block-blog-list-item {
	position: relative;
	display: flex;
	flex-direction: column;
	cursor: var(--cursor-style);
	cursor: pointer;
	border-radius: 5px;
	transition: box-shadow 0.3s $easing-standard;

	// Image always fills up the parent wrapper
	&__cover-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	// Make the image wrapper always keep the same 5:3 aspect ratio
	&__cover-image-wrapper {
		position: relative;
		padding-bottom: 60%;
	}

	&__cover-image-container {
		padding-bottom: 20px;
	}

	&__text {
		margin-bottom: 12px;
		text-decoration: none;
	}

	&__post-link {
		text-decoration: none;
	}
}
</style>
