<template>
	<GridInstagramFeed :media="media" />
</template>

<script>

import GridInstagramFeed from '@site-modules/components/elements/instagram-feed/GridInstagramFeed.vue';
import { useGridInstagramFeed } from '@site-modules/components/elements/instagram-feed/useGridInstagramFeed';

import { getTokenPublic } from '@/api/InstagramApi';

export default {
	components: {
		GridInstagramFeed,
	},
	props: {
		id: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
	},
	setup(props) {
		const {
			media,
			init,
		} = useGridInstagramFeed(props, {
			// TODO: replace it with URL instead of callback
			getInstagramTokenHandler: getTokenPublic,
		});

		init();

		return {
			media,
		};
	},
};
</script>
