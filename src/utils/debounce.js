/**
 *
 * @param {function} fn Callback function
 * @param {number} time timeout
 */
export const debounce = (function_, time) => {
	let timeout;

	return function executedFunction() {
		// eslint-disable-next-line prefer-rest-params
		const functionCall = () => Reflect.apply(function_, this, arguments);

		clearTimeout(timeout);
		timeout = setTimeout(functionCall, time);
	};
};
