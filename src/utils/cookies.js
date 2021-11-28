// source https://hugo-soltys.com/blog/create-a-simple-cookie-banner-in-a-few-minutes

export const getCookie = (cname) => {
	const name = `${cname}=`;
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');

	for (let i = 0; i < ca.length; i += 1) {
		let c = ca[i];

		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}

		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}

	return '';
};

export const setCookie = (cname, cvalue, exdays, { cdomain = null } = {}) => {
	const d = new Date();

	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

	const expires = exdays ? `expires=${d.toUTCString()};` : '';
	const domain = cdomain ? `domain=${cdomain};` : '';

	document.cookie = `${cname}=${cvalue};${expires}path=/;${domain}`;
};
