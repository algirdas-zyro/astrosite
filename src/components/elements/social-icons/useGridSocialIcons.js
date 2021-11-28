import {
	reactive,
	computed,
} from 'vue-demi';

export const useGridSocialIcons = (props) => {
	const styles = computed(() => props.data.settings.styles);

	const composedProperties = reactive({ // only expose (return) consumer props as an object
		links: computed(() => props.data.links),
		direction: computed(() => styles.value['icon-direction']),
		directionMobile: computed(() => styles.value['m-icon-direction']),
		fullHeight: computed(() => !styles.value.justify),
		preventSpacing: computed(() => (styles.value['icon-spacing'] !== 'center'
		|| styles.value['icon-direction'] === 'column'
			? !styles.value.justify
			: !styles.value.align)),

	});

	return composedProperties;
};
