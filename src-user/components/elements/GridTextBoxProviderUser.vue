<template>
	<GridTextBox
		@click="linkClickHandler"
		v-html="data.content"
	/>
</template>

<script>
import GridTextBox from '@site-modules/components/elements/text-box/GridTextBox.vue';
import { useLink } from '@site-modules/use/useLink';

export default {
	name: 'GridTextBoxProviderUser',
	components: {
		GridTextBox,
	},
	props: {
		data: {
			type: Object,
			required: true,
		},
	},
	setup() {
		const { linkClickHandler } = useLink();

		return {
			linkClickHandler,
		};
	},
};
</script>
