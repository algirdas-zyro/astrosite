<template>
	<!--
		As user can embed anything to grid embed it can greatly impact his page speed in addition to skewing
		the overall statistics of the user site speed, so we use IntersectionObserver to render GridEmbed only
		when it has been intersected
	-->
	<GridEmbed
		ref="gridEmbedRef"
		:should-render="isObserved"
		:srcdoc="srcdoc"
		:height="data.settings.styles.height"
	/>
</template>
<script>
import { ref } from 'vue-demi';

import GridEmbed from '@site-modules/components/elements/embed/GridEmbed.vue';
import { constructSrcdoc } from '@site-modules/components/elements/embed/constructSrcdoc';
import { useObserver } from '@site-modules/use/useObserver';

export default {
	components: {
		GridEmbed,
	},
	props: {
		data: {
			type: Object,
			default: () => ({}),
		},
		id: {
			type: String,
			default: null,
		},
	},
	setup() {
		const gridEmbedRef = ref(null);
		const { isObserved } = useObserver(gridEmbedRef);

		return {
			gridEmbedRef,
			isObserved,
		};
	},
	computed: {
		srcdoc() {
			return constructSrcdoc(this.data.content);
		},
	},
};
</script>
