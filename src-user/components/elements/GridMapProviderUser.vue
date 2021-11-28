<template>
	<GridMap
		ref="mapRef"
		v-bind="composedProps"
	/>
</template>

<script>
import { ref } from 'vue-demi';

import GridMap from '@site-modules/components/elements/map/GridMap.vue';
import { useGridMap } from '@site-modules/components/elements/map/useGridMap';

export default {
	name: 'GridMapProviderUser',
	components: {
		GridMap,
	},
	props: {
		data: {
			type: Object,
			required: true,
		},
	},
	setup(props) {
		const mapRef = ref(null);
		const { composedProps } = useGridMap(props, mapRef);

		return {
			mapRef,
			composedProps,
		};
	},
};
</script>
