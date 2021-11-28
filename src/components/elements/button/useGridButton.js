import { computed } from 'vue-demi';

import { ANCHOR_TAG } from '../../../constants';
import { useLink } from '../../../use/useLink';

const BUTTON_TAG = 'button';
const SUBMIT_TYPE = 'submit';

export const useGridButton = (props) => {
	const { linkClickHandler } = useLink();

	const isFormButton = computed(() => !!props.data.settings.isFormButton);
	const tagName = computed(() => (isFormButton.value ? BUTTON_TAG : ANCHOR_TAG));
	const href = computed(() => (tagName.value === BUTTON_TAG ? null : props.data.settings.href));
	const target = computed(() => (tagName.value === BUTTON_TAG ? null : props.data.settings.target));
	const rel = computed(() => props.data.settings.rel || undefined);

	return {
		tagName,
		href,
		target,
		rel,
		linkClickHandler,
		type: computed(() => props.data.settings.type),
		buttonType: computed(() => (isFormButton.value ? SUBMIT_TYPE : null)),
		content: computed(() => props.data.content),
		name: computed(() => (isFormButton.value ? SUBMIT_TYPE : null)),
	};
};
