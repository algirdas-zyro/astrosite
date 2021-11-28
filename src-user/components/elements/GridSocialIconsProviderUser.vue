<template>
	<GridSocialIcons v-bind="composedProps" />
</template>

<script>
import GridSocialIcons from '@site-modules/components/elements/social-icons/GridSocialIcons.vue';
import { useGridSocialIcons } from '@site-modules/components/elements/social-icons/useGridSocialIcons';

export default {
	components: {
		GridSocialIcons,
	},
	props: {
		data: {
			type: Object,
			required: true,
		},
	},
	setup(props, context) {
		return {
			composedProps: useGridSocialIcons(props, context),
		};
	},
};
</script>
