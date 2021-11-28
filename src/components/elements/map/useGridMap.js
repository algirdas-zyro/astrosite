import {
	ref,
	computed,
	reactive,
	watchEffect,
} from 'vue-demi';

import { useObserver } from '../../../use/useObserver';

// eslint-disable-next-line consistent-return
export const useGridMap = (props, mapReference) => {
	try {
		const { isObserved } = useObserver(mapReference);
		const isIframeLoaded = ref(false);

		const composedProperties = reactive({
			src: computed(() => props.data.settings?.src),
			shouldRender: computed(() => isObserved.value),
			isIframeLoaded: computed(() => isIframeLoaded.value),
		});

		// When mapRef is rendered, find an iframeRef and wait for load event.
		const stopReferenceWatcher = watchEffect(() => {
			const mapReferences = mapReference.value?.$refs;

			if (mapReferences) {
				mapReferences.iframeRef.addEventListener('load', () => {
					isIframeLoaded.value = true;
				});
				stopReferenceWatcher();
			}
		});

		return {
			composedProps: composedProperties,
		};
	} catch (error) {
		console.error(error);
	}
};
