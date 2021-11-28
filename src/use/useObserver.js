import {
	ref,
	onBeforeUnmount,
	watchEffect,
} from 'vue-demi';

const DEFAULT_MARGIN = '500px';

/**
 * Composable to track when the element is about to enter viewport (once).
 *
 * @param {Ref<VueConstructor>} templateRef - A Vue template ref returned via composition API
 * @param {string=DEFAULT_MARGIN} rootMargin - An offset (optional, defaults to DEFAULT_MARGIN)
 * @returns {{
 *   isObserved: Ref<boolean>
 * }} - An object with current isObserved state
 */
export const useObserver = (templateReference, rootMargin = DEFAULT_MARGIN) => {
	const isObserved = ref(false);

	try {
		const observer = new IntersectionObserver(
			([{ isIntersecting }]) => {
				if (isIntersecting) {
					isObserved.value = true;
					observer.disconnect();
				}
			},
			{
				threshold: 0,
				rootMargin,
			},
		);

		// Watch for templateRef change; Start observing and stop watching if there's and $el mounted.
		const stopReferenceWatcher = watchEffect(() => {
			if (templateReference.value) {
				// Check if passed templateRef has an $el. If so - get the $el, if not, get the ref itelf
				const templateElement = templateReference.value.$el ?? templateReference.value;

				observer.observe(templateElement);
				stopReferenceWatcher();
			}
		});

		onBeforeUnmount(() => observer.disconnect());
	} catch (error) {
		console.error(error);
	}

	return {
		isObserved,
	};
};
