import {
	ref,
	computed,
} from 'vue-demi';

import { INSTAGRAM_MEDIA_PLACEHOLDERS } from '../../../constants/instagramPlaceholders';

import { getMedia } from '../../../api/InstagramApi';

export const useGridInstagramFeed = (props, {
	getInstagramTokenHandler,
	cleanupCallback,
}) => {
	const limit = computed(() => props.data.settings['item-count']);
	const token = ref(null);
	const responseResult = ref([]);

	const media = computed(() => (responseResult.value.length > 0
		? responseResult.value.slice(0, limit.value)
		: new Array(limit.value).fill({})));

	const getInstagramMedia = async () => {
		const { data } = await getMedia('id,permalink,caption,media_url', token.value);

		responseResult.value = data.map((item) => ({
			id: item.id,
			src: item.media_url,
			alt: item.caption,
			href: item.permalink,
		}));
	};

	const init = async () => {
		token.value = await getInstagramTokenHandler(props.id);

		if (token.value) {
			try {
				await getInstagramMedia();
			} catch (error) {
				responseResult.value = INSTAGRAM_MEDIA_PLACEHOLDERS;

				if (cleanupCallback) {
					cleanupCallback(token.value);
				}

				throw error;
			}
		} else {
			responseResult.value = INSTAGRAM_MEDIA_PLACEHOLDERS;
		}
	};

	return {
		media,
		init,
		itemGap: computed(() => props.data.settings.styles['item-gap']),
	};
};

/**
 * TODO:
 * preconnect instagram to head
 * proper multi-step error handling
 * refactor overall logic - missign token should not fall back to unsplash by default
 */
