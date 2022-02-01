<template>
	<div class="blog-list-item-meta">
		<div class="font-secondary">
			<p
				v-show="showName"
				class="blog-list-item-meta__author-name"
			>
				{{ authorName }}
			</p>
			<p
				v-show="showDate || showMinutes"
				class="blog-list-item-meta__subtitle"
			>
				<span v-if="showDate && date">
					{{ date }}
				</span>
				<span v-if="showMinutes">
					{{ `${minutesAmount} ${minReadText}` }}
				</span>
			</p>
		</div>
	</div>
</template>

<script>
const DEFAULT_MIN_READ_TEXT = 'min read'; // TODO: should come from UI/data.json for translations

export default {
	props: {
		authorName: {
			type: String,
			default: '',
		},
		minutesAmount: {
			type: String,
			default: '0',
		},
		minReadText: {
			type: String,
			default: DEFAULT_MIN_READ_TEXT,
		},
		date: {
			type: String,
			default: '',
		},
		showAvatar: {
			type: Boolean,
			default: true,
		},
		showName: {
			type: Boolean,
			default: true,
		},
		showDate: {
			type: Boolean,
			default: true,
		},
		showMinutes: {
			type: Boolean,
			default: true,
		},
	},
};
</script>

<style lang="scss">
@import '@/components/blocks/blog/BlockBlogFonts.scss';

.blog-list-item-meta {
	display: flex;
	flex-direction: row;
	align-items: center;

	&__author-name {
		margin-bottom: 4px;
	}

	&__subtitle {
		span:nth-of-type(2)::before {
			content: "·";
		}
	}
}
</style>
