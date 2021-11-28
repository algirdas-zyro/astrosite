<template>
	<GridButton
		:tag-name="tagName"
		:href="href"
		:target="target"
		:rel="rel"
		:type="type"
		:button-type="buttonType"
		:content="content"
		@click="linkClickHandler"
	/>
</template>

<script>
import GridButton from '@site-modules/components/elements/button/GridButton.vue';
import { useGridButton } from '@site-modules/components/elements/button/useGridButton';

export default {
	name: 'GridButtonProviderUser',
	components: {
		GridButton,
	},
	props: {
		data: {
			type: Object,
			required: true,
		},
	},
	setup(props) {
		const {
			tagName,
			href,
			target,
			rel,
			linkClickHandler,
			type,
			buttonType,
			content,
		} = useGridButton(props);

		return {
			tagName,
			href,
			target,
			rel,
			type,
			buttonType,
			content,
			linkClickHandler,
		};
	},
};
</script>
