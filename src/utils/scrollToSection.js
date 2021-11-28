import {
	BLOCK_HEADER_CLASS,
	BLOCK_HEADER_STICKY_CLASS,
} from '../constants';

export const scrollToSection = (linkToSection) => {
	const elementTop = document.querySelector(linkToSection)?.getBoundingClientRect().top;

	// If section is not found, do not scroll.
	if (!elementTop) {
		return;
	}

	const headerHeight = document.querySelector(`.${BLOCK_HEADER_CLASS}`).offsetHeight;
	const isHeaderSticky = document.querySelector(`.${BLOCK_HEADER_STICKY_CLASS}`);

	window.scrollBy({
		top: isHeaderSticky ? elementTop - headerHeight : elementTop,
		behavior: 'smooth',
	});
};
