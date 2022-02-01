<!-- TODO: Update SVG inlining. For now, this is done for user app performance -->
<template>
	<div
		v-if="pageCount > 1"
		class="pagination"
	>
		<button
			:disabled="currentPage === 1"
			class="pagination__button"
			data-testId="button-previous"
			@click="$emit('change-page', Math.max(1, currentPage - 1))"
		>
			<svg
				width="8"
				height="14"
				viewBox="0 0 8 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7 1L1 7L7 13"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
		<button
			v-for="paginationTrigger in paginationTriggers"
			:key="`${paginationTrigger}-trigger`"
			class="pagination__button pagination__trigger"
			:data-testId="`button-${paginationTrigger}`"
			:class="{ 'pagination__trigger--current': paginationTrigger === currentPage }"
			@click="$emit('change-page', paginationTrigger)"
		>
			{{ paginationTrigger }}
		</button>
		<button
			:disabled="currentPage === pageCount"
			class="pagination__button"
			data-testId="button-next"
			@click="$emit('change-page', Math.min(pageCount, currentPage + 1))"
		>
			<svg
				width="8"
				height="14"
				viewBox="0 0 8 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1 13L7 7L1 1"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</div>
</template>

<script>
export default {
	props: {
		currentPage: {
			type: Number,
			required: true,
		},
		pageCount: {
			type: Number,
			required: true,
		},
	},
	computed: {
		paginationTriggers() {
			const {
				currentPage,
				pageCount,
			} = this;
			const maxVisiblePages = 5;

			if (maxVisiblePages > pageCount) {
				return [...new Array(pageCount + 1).keys()].slice(1);
			}

			// https://css-tricks.com/creating-a-reusable-pagination-component-in-vue/
			const visiblePagesThreshold = (maxVisiblePages - 1) / 2;
			const paginationTriggersArray = Array.from({
				length: maxVisiblePages - 1,
			}).fill(0);

			if (currentPage <= visiblePagesThreshold + 1) {
				paginationTriggersArray[0] = 1;
				const paginationTriggers = paginationTriggersArray.map(
					(paginationTrigger, index) => paginationTriggersArray[0] + index,
				);

				paginationTriggers.push(pageCount);

				return paginationTriggers;
			}

			if (currentPage >= pageCount - visiblePagesThreshold + 1) {
				const paginationTriggers = paginationTriggersArray.map(
					(paginationTrigger, index) => pageCount - index,
				);

				paginationTriggers.reverse().unshift(1);

				return paginationTriggers;
			}

			paginationTriggersArray[0] = currentPage - visiblePagesThreshold + 1;
			const paginationTriggers = paginationTriggersArray.map(
				(paginationTrigger, index) => paginationTriggersArray[0] + index,
			);

			paginationTriggers.unshift(1);
			paginationTriggers[paginationTriggers.length - 1] = pageCount;

			return paginationTriggers;
		},
	},
};
</script>
<style lang="scss">
// TODO: No designs for this. Update when they are in.
// Specificity increased because zyro-button overrides pagination styles
// Colors hard-coded because component is used in user-app as well, and variables differ.
.pagination {
	display: flex;
	align-items: center;

	&__button {
		min-width: 36px;
		min-height: 36px;
		padding: 4px 1px;
		font-size: 10px;
		line-height: 1.6em;
		cursor: pointer;
		background: transparent;
		transition: color 0.3s ease-in-out;

		&:hover,
		&:active {
			color: $secondary;
		}
	}

	&__trigger {
		color: $dark;
		transition: color 0.3s ease-in-out;

		&--current {
			font-weight: 500;
			color: $secondary;
		}
	}
}
</style>
