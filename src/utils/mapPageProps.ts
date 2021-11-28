export const mapPageProps = (pageId, page, siteData) => {
	const { meta } = siteData;
	const { homePageId } = meta;
	const isHomePage = pageId === homePageId;

	const blocks = page.blocks.map((blockId) => {
		console.log(blockId);
		const block = siteData.blocks[blockId];

		const elements = block.components
			// .filter(({ hidden }) => !hidden)
			.map((elementId) => {
				const element = siteData.components[elementId];
				return {
					id: elementId,
					...element,
				};
			});

		return {
			id: blockId,
			...block,
			elements,
		};
	});

	return {
		params: {
			slug: page.slug,
		},
		props: {
			page: {
				...page,
				blocks: blocks,
				header: siteData.blocks?.navigation,
				nav: siteData.navigation,
				...(isHomePage && { isHomePage: true })
			},
		},
	};
};
