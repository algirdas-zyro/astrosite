import { getPageIdByPath } from '../utils/getPageIdByPath';

export const getFeaturesToPreconnectByPage = (websiteData, pagePath = '/') => {
	const {
		meta,
		pages,
		blocks,
		components,
	} = websiteData;

	const pageId = getPageIdByPath(websiteData, pagePath);

	const footerBlock = Object.values(blocks).find((block) => block.slot === 'footer');
	const pageBlocksArray = [
		...pages[pageId].blocks.reduce((blocksArray, blockId) => [
			...blocksArray,
			blocks[blockId],
		], []),
		...(footerBlock ? [footerBlock] : []),
	];
	const hasMatchingBlock = (blockToMatch) => pageBlocksArray.some(({ type }) => type === blockToMatch);

	const pageComponentsArray = pageBlocksArray.reduce((componentsArray, block) => [
		...componentsArray,
		...block.components.map((componentId) => components[componentId]),
	], []);
	const hasMatchingComponent = (componentToMatch) => pageComponentsArray.some(({ type }) => type === componentToMatch);

	const pageVideoComponentsArray = pageComponentsArray.filter(({ type }) => type === 'GridVideo');
	const hasMatchingVideoSrc = (text) => pageVideoComponentsArray.some(({ settings }) => settings.src.includes(text));

	return {
		hasEcwid: hasMatchingBlock('BlockEcwidStore'),
		hasInstagram: hasMatchingComponent('GridInstagramFeed'),
		hasMap: hasMatchingComponent('GridMap'),
		hasMessenger: !!meta.facebookMessenger,
		hasVimeo: hasMatchingVideoSrc('vimeo.com'),
		hasYoutube: hasMatchingVideoSrc('youtube.com'),
	};
};
