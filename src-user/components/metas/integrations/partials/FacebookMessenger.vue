<template>
	<div>
		<div id="fb-root" />
		<div
			class="fb-customerchat"
			attribution="install_email"
			:page_id="pageId"
		/>
	</div>
</template>

<script>
import { isAppPrerendering } from '@site-modules/utils/isAppPrerendering';
import { FACEBOOOK_MESSENGER_SCRIPT_VERSION } from '@user/components/metas/constants';
import {
	facebookMessengerScript,
	facebookMessengerScriptAsync,
} from '@user/components/metas/integrations/scripts';

export default {
	props: {
		pageId: {
			type: [
				Number,
				String,
			],
			required: true,
		},
		locale: {
			type: String,
			default: null,
		},
	},
	metaInfo() {
		return {
			script: isAppPrerendering
				? []
				: [
					facebookMessengerScript({
						version: FACEBOOOK_MESSENGER_SCRIPT_VERSION,
						locale: this.locale,
					}),
					facebookMessengerScriptAsync({
						locale: this.locale,
					}),
				],
		};
	},
};
</script>
