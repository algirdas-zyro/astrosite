<template>
	<BlockBlogList
		:data="data"
		:block-id="blockId"
		:posts="posts"
		:user-full-name="userFullName"
		@post-click="handlePostClick"
	/>
</template>

<script>
import {
	mapState,
	mapGetters,
} from 'vuex';

import BlockBlogList from '@site-modules/components/blocks/blog/BlockBlogList.vue';
import { mockPosts } from '@site-modules/components/blocks/blog/mockPosts';

export default {
	name: 'BlockBlogListProviderUser',
	components: {
		BlockBlogList,
	},
	props: {
		blockId: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
		isBlockPreviewMode: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		...mapState('user', ['user']),
		...mapGetters('pages', ['publishedBlogPages']),
		userFullName() {
			return this.user?.fullName;
		},
		posts() {
			return this.isBlockPreviewMode ? mockPosts : this.publishedBlogPages;
		},
	},
	methods: {
		handlePostClick(post) {
			this.$router.push({
				path: post.slug,
			});
		},
	},
};
</script>
