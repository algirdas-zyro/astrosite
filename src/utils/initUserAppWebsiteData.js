import { addFontLinks } from '../utils/addFontLinks';
import { constructFontHref } from '../utils/font';

export const initUserAppWebsiteData = (website) => {
	if (!website) {
		return;
	}

	addFontLinks(constructFontHref(website.styles));
};
