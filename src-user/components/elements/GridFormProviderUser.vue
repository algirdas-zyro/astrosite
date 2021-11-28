<template>
	<GridForm
		:id="id"
		:form-id="data.formId"
		:settings="data.settings"
		:submit-button-data="data.submitButtonData"
		:styles="computedStyles"
		:show-success-message="showSuccessMessage"
		:is-error="isError"
		:is-user-site="$options.IS_USER_SITE"
		:theme="data.settings.theme"
		@on-submit="onSubmit"
	>
		<PostSubmitElement
			:show-success-message="showSuccessMessage"
			:success-message="data.settings.successMessage"
			:is-loading="isLoading"
			:is-error="isError"
			:theme="data.settings.theme"
		/>
	</GridForm>
</template>

<script>
import {
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';

import GridForm from '@site-modules/components/elements/form/GridForm.vue';
import PostSubmitElement from '@site-modules/components/elements/form/PostSubmitElement.vue';
import {
	MINIMUM_LOAD_TIME,
	SUBMIT_ACTIONS,
} from '@site-modules/components/elements/form/constants';
import { useGridForm } from '@site-modules/components/elements/form/useGridForm';

import { saveData } from '@/api-user/UserDataApi';

const IS_USER_SITE = true;

export default {
	IS_USER_SITE,
	components: {
		GridForm,
		PostSubmitElement,
	},
	props: {
		id: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
	},
	setup(props) {
		const { computedStyles } = useGridForm(props);

		return {
			computedStyles,
		};
	},
	data() {
		return {
			isLoading: false,
			showSuccessMessage: false,
			isError: false,
		};
	},
	computed: {
		...mapState(['website']),
		...mapGetters('pages', ['defaultPages']),
	},
	methods: {
		...mapActions('pages', ['changePage']),
		async onSubmit(model) {
			this.isLoading = true;
			let allowLoadingToStop = false;

			// Set minimum load time to 200ms
			setTimeout(() => {
				allowLoadingToStop = true;
				this.isLoading = !(this.showSuccessMessage || this.isError);
			}, MINIMUM_LOAD_TIME);
			try {
				await saveData(this.website.forms[this.data.formId].token, model);
				this.showSuccessMessage = true;

				if (!this.data.settings.submitRedirectPage?.pageId) {
					return;
				}

				const { pageId } = this.data.settings.submitRedirectPage;
				const { submitAction } = this.data.settings;
				const pageExists = Object.keys(this.defaultPages).includes(pageId);

				if (!pageExists || submitAction.id !== SUBMIT_ACTIONS.LINK_TO_PAGE) {
					return;
				}

				const { slug } = Object.entries(this.defaultPages).find(([currentPageId]) => currentPageId === pageId)[1];

				this.$router.push({
					path: `/${slug}`,
				});
			} catch {
				this.isError = true;
			} finally {
				if (allowLoadingToStop) {
					this.isLoading = false;
				}
			}
		},
	},
};
</script>
