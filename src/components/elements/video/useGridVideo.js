// This composable is only used to return rempaped props if there are no poster props.
import {
	computed,
	reactive,
	watchEffect,
} from 'vue-demi';

import { extractVideoProps } from '../../../components/elements/video/extractVideoProps';

export const useGridVideo = (props) => {
	const reactiveProps = reactive({
		src: null,
		provider: null,
		width: null,
		height: null,
		webp: null,
		jpg: null,
	});

	const composedProps = reactive({
		src: computed(() => reactiveProps.src ?? props.data.settings.src),
		provider: computed(() => reactiveProps.provider ?? props.data.settings.provider),
		width: computed(() => reactiveProps.width ?? props.data.settings.width),
		height: computed(() => reactiveProps.height ?? props.data.settings.height),
		webp: computed(() => reactiveProps.webp ?? props.data.settings.webp),
		jpg: computed(() => reactiveProps.jpg ?? props.data.settings.jpg),
	});

	watchEffect(() => {
		// This is temporary and should be done by mappers.
		// If there is a .src change or there is no poster (.jpg) make a call to extract new posters.
		// Then remap all extracted props and proxy them to `composedProps`.
		if (props.data.settings.src !== composedProps.src || !props.data.settings.jpg) {
			extractVideoProps(props.data.settings.src).then((extractedProps) => {
				Object.entries(extractedProps).forEach(([key, value]) => {
					reactiveProps[key] = value;
				});
			});
		}
	});

	return {
		composedProps,
	};
};
