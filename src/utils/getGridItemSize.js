export const FULL_WIDTH = 1920; // just assume that largest screen is 1920

export const getGridItemSize = (blockData, elementPosition) => {
	const [
		rowStartIndex,
		columnStartIndex,
		rowEndIndex,
		columnEndIndex,
	] = elementPosition.split('/').map(parseFloat);

	const { styles } = blockData.settings ?? {};

	const columnCount = Number.parseFloat(styles?.['column-count']) ?? 12; // should be hardoded
	const contentWidth = Number.parseFloat(styles?.['content-width']) ?? 1600; // should be hardcoded
	const gridWidth = Number.parseFloat(styles?.['grid-width']) ?? 1224; // should be hardcoded
	const rowSize = Number.parseFloat(styles?.['row-size']) ?? 48; // should be hardcoded

	const columnGap = Number.parseFloat(styles?.['column-gap']) ?? 24; // only gaps are actually dynamic
	const rowGap = Number.parseFloat(styles?.['row-gap']) ?? 16; // only gaps are actually dynamic

	const columnWidth = (gridWidth - ((columnCount - 1) * columnGap)) / columnCount;
	const fullWidthOffset = (FULL_WIDTH - contentWidth) / 2 + columnGap;
	const contentOffset = (contentWidth - gridWidth) / 2 - columnGap;

	let width = FULL_WIDTH;

	const rowDiff = rowEndIndex - rowStartIndex;
	const height = (rowDiff * rowSize) + ((rowDiff - 1) * rowGap);

	// if column is not very left or very right, subtract fullWidthOffset
	if (columnStartIndex !== 1) {
		width -= fullWidthOffset;
	}

	if (columnEndIndex !== 17) {
		width -= fullWidthOffset;
	}

	// if column is within grid limit (3 to 15), always subtract contentOffset
	if (columnStartIndex > 2) {
		width -= contentOffset;
	}

	if (columnEndIndex < 16) {
		width -= contentOffset;
	}

	// if column is within content limit (3 to 15), always subtract contentOffset
	if (columnStartIndex > 3) {
		width -= (columnStartIndex - 3) * (columnWidth + columnGap);
	}

	if (columnEndIndex < 15) {
		width -= (15 - columnEndIndex) * (columnWidth + columnGap);
	}

	// if there is just one column, set columnWidth as width
	// (could be an early return, but conflicts with object return)
	if (columnEndIndex - columnStartIndex === 1) {
		width = columnWidth;
	}

	return {
		width,
		height,
	};
};
