/* eslint-disable unicorn/filename-case */
export const parseCSSSides = (value) => {
	const sides = value.split(' ');

	const numberOfSides = sides.length;

	if (numberOfSides < 1 || numberOfSides > 4) {
		throw new Error(`Cannot parse ${numberOfSides} sides`);
	}

	const createSides = (
		top,
		right = top,
		bottom = top,
		left = right,
	) => ({
		top,
		right,
		bottom,
		left,
	});

	return createSides(...sides);
};
