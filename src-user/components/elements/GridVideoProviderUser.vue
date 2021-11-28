<template>
	<GridVideo
		ref="mapRef"
		v-bind="composedProps"
		:src="composedSrc"
		:render-iframe="renderIframe"
		:render-picture="renderPicture"
		@click.once="renderIframe = true"
	/>
</template>

<script>
import {
	ref,
	computed,
	onMounted,
	getCurrentInstance,
} from 'vue-demi';

import GridVideo from '@site-modules/components/elements/video/GridVideo.vue';
import {
	URL_PARAMS,
	FALSY_PARAM_VALUE,
	TRUTHY_PARAM_VALUE,
} from '@site-modules/components/elements/video/constants';
import { useGridVideo } from '@site-modules/components/elements/video/useGridVideo';

// Minimum timeout, based on multiple tests on PageSpeed Insights:
const MOBILE_AUTO_TIMEOUT = 3000;

export default {
	name: 'GridVideoProviderUser',
	components: {
		GridVideo,
	},
	props: {
		data: {
			type: Object,
			required: true,
		},
	},
	setup(props) {
		const { composedProps } = useGridVideo(props);
		const { isMobileScreen } = getCurrentInstance()?.proxy?.$store?.state?.gui ?? {};

		const mapRef = ref(null);

		const shouldAutoplay = computed(
			() => props.data.settings.src?.includes(`${[URL_PARAMS.AUTOPLAY]}=${TRUTHY_PARAM_VALUE}`) ?? false,
		);

		/**
		 * If .src contains 'autoplay=0' or on mobile, force it to 'autoplay=1' as autoplay is handled
		 * by 'shouldAutoplay' via IntersectionObserver.
		 *
		 * Also, if 'shouldAutoplay', switch mute param to TRUTHY_PARAM_VALUE.
		 */
		const composedSource = computed(() => {
			const muteParameterLabel = URL_PARAMS.MUTE[composedProps.provider];

			const source = isMobileScreen
				? composedProps.src
				: composedProps.src.replace(
					`${[URL_PARAMS.AUTOPLAY]}=${FALSY_PARAM_VALUE}`,
					`${[URL_PARAMS.AUTOPLAY]}=${TRUTHY_PARAM_VALUE}`,
				);

			return shouldAutoplay.value
				? source.replace(
					`${[muteParameterLabel]}=${FALSY_PARAM_VALUE}`,
					`${[muteParameterLabel]}=${TRUTHY_PARAM_VALUE}`,
				)
				: source;
		});

		const renderIframe = ref(false);
		const renderPicture = ref(false);

		const init = () => {
			const observer = new IntersectionObserver(([{ isIntersecting }]) => {
				if (isIntersecting) {
					if (shouldAutoplay.value && !isMobileScreen) {
						renderIframe.value = true;
					} else {
						renderPicture.value = true;
					}

					observer.disconnect();
				}
			}, {
				threshold: 0,
			});

			observer.observe(mapRef.value.$el);

			/**
			 * Automatically switch to iframes in mobile mode after a timeout.
			 *
			 * Real iframe embed (instead of thumbnail) should be only displayed upon click.
			 * Videos have src ajusted to always have 'autoplay=1' and should start playing when rendered.
			 *
			 * This does not work on mobile, as user has to implicitly tap on iframe to play it.
			 * So, this timeout just shows iframe instead of thumbnails in mobile mode.
			 *
			 * This does not damage UX (user can still click on thumbnail) and satisfies page speed tools.
			 */
			if (isMobileScreen) {
				setTimeout(() => {
					renderIframe.value = true;
				}, MOBILE_AUTO_TIMEOUT);
			}
		};

		onMounted(() => init());

		return {
			mapRef,
			composedProps,
			composedSrc: composedSource,
			renderIframe,
			renderPicture,
		};
	},
};
</script>
