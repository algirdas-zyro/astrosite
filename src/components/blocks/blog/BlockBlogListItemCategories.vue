<template>
	<p class="categories">
		<span
			v-for="(categoryId, index) in categories"
			:key="categoryId"
			class="categories__item"
			@click="$emit('filter-category', categories[index])"
		>
			{{ categoryNameById(categoryId).toUpperCase() }}
		</span>
	</p>
</template>

<script>
// import { mapGetters } from 'vuex';

export default {
	props: {
		categories: {
			type: Array,
			default: () => ([]),
		},
	},
	computed: {
		...mapGetters('blog', ['categoryNameById']),
	},
};
</script>

<style lang="scss" scoped>
.categories {
	margin-bottom: 16px;

	&__item {
		color: var(--colors-primary);
		cursor: pointer;

		&:not(:first-child)::before {
			margin: 0 16px;
			content: "·";
		}
	}
}
</style>
