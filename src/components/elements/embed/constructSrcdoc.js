import { GRID_EMBED_STYLE_RESET } from '../../../components/elements/embed/constants';

export const constructSrcdoc = (content) => {
	const temporaryElement = document.createElement('div');

	temporaryElement.innerHTML = content;

	const extractStylesScripts = [...temporaryElement.children].reduce((acc, curr) => {
		if (curr.tagName === 'STYLE') {
			return {
				...acc,
				styles: `${acc.styles} ${curr.outerHTML}`,
			};
		}

		if (curr.tagName === 'SCRIPT') {
			return {
				...acc,
				scripts: `${acc.scripts} ${curr.outerHTML}`,
			};
		}

		return {
			...acc,
			html: `${acc.html} ${curr.outerHTML}`,
		};
	}, {
		styles: GRID_EMBED_STYLE_RESET,
		scripts: '',
		html: '',
	});

	return `<!DOCTYPE html>
	<head>${extractStylesScripts.styles}</head>
	<body>${extractStylesScripts.html}${extractStylesScripts.scripts}</body>
</html>`;
};
