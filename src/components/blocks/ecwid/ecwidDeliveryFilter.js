/* eslint-disable max-len */
import latinize from 'latinize';

import { debounce } from '../../../utils/debounce';

import lpExpressFilterHtml from './lpExpressFilterHtml';
import omnivaFilterHtml from './omnivaFilterHtml';
import otherFilterHTML from './otherFilterHtml';
import searchInputHtml from './searchInputHtml';

export default {
	watchForDeliveryOptions(ms) {
		return setInterval(() => {
			const ecwidRadioDeliveryOptions = document.querySelector('.ec-radiogroup__items');

			if (ecwidRadioDeliveryOptions) {
				// insert search element if doesn't exist

				const isDeliveryStepComplete = document.querySelector('.ec-cart-step--delivery .ec-cart-step__icon--done');
				const zyroSearchField = document.querySelector('.zyro-ecwid__search');

				if (zyroSearchField || isDeliveryStepComplete) {
					// wait and do nothing, delivery selection either in progress or completed
					if (isDeliveryStepComplete) {
						const deliveryOptionList = document.querySelector('.ec-cart-step--delivery .ec-radiogroup');

						if (deliveryOptionList) {
							deliveryOptionList.remove();
						}

						if (zyroSearchField) {
							zyroSearchField.remove();
						}
					} else {
						// wait and do nothing, delivery selection either in progress or completed
					}
				} else {
					// collect all options info
					const dataOptions = [];
					const allLabelOptions = ecwidRadioDeliveryOptions.querySelectorAll('.ec-radiogroup__item');

					allLabelOptions.forEach((label) => {
						const title = label.querySelector('.ec-radiogroup__title').innerText;
						const isOmniva = title.includes('Omniva');
						const isLPExpress = title.includes('LPExpress');

						dataOptions.push({
							title: latinize(title.toLowerCase()),
							description: latinize(label.querySelector('.ec-radiogroup__text').innerText.toLowerCase()),
							element: label,
							cost: label.querySelector('.ec-radiogroup__data').innerText,
							selected: label.querySelector('input').checked,
							isOmniva,
							isLPExpress,
							isOther: !isOmniva && !isLPExpress,
						});
					});

					const LPExpressOptions = dataOptions.filter((option) => option.isLPExpress);
					const OmnivaOptions = dataOptions.filter((option) => option.isOmniva);
					const otherOptions = dataOptions.filter((option) => option.isOther);

					if (LPExpressOptions.length || OmnivaOptions.length) {
						const zyroInputSearch = searchInputHtml;
						const radioSection = ecwidRadioDeliveryOptions.closest('.ec-cart-step__section');
						const ecwidRadioDeliveryWrapper = radioSection.querySelector('.ec-radiogroup__wrap');

						// afterbegin is not working :( changed order with flex order
						radioSection.insertAdjacentHTML('beforeend', zyroInputSearch);
						radioSection.classList.add('zyro-ecwid__radio-section');
						radioSection.querySelector('.zyro-ecwid__search input').addEventListener('input', debounce((event) => {
							// eslint-disable-next-line no-console
							const searchValue = latinize(event.target.value.toLowerCase());

							dataOptions.forEach((option) => {
								if (option.title.includes(searchValue)
										|| option.description.includes(searchValue)) {
									if (radioSection.querySelector('#filter-lpexpress')?.checked && option.isLPExpress) {
										option.element.classList.remove('zyro-ecwid__hidden');
									} else if (radioSection.querySelector('#filter-omniva')?.checked && option.isOmniva) {
										option.element.classList.remove('zyro-ecwid__hidden');
									} else if (radioSection.querySelector('#filter-other')?.checked && option.isOther) {
										option.element.classList.remove('zyro-ecwid__hidden');
									}
								} else {
									option.element.classList.add('zyro-ecwid__hidden');
								}
							});
						}), 30);

						const selectedOption = dataOptions.find((option) => option.selected);

						if (LPExpressOptions.length && selectedOption.isLPExpress) {
							dataOptions.forEach((option) => {
								option.element.classList.add('zyro-ecwid__hidden');
							});
							LPExpressOptions.forEach((option) => {
								option.element.classList.remove('zyro-ecwid__hidden');
							});
						}

						if (OmnivaOptions.length && selectedOption.isOmniva) {
							dataOptions.forEach((option) => {
								option.element.classList.add('zyro-ecwid__hidden');
							});
							OmnivaOptions.forEach((option) => {
								option.element.classList.remove('zyro-ecwid__hidden');
							});
						}

						if (otherOptions.length && selectedOption.isOther) {
							dataOptions.forEach((option) => {
								option.element.classList.add('zyro-ecwid__hidden');
							});
							otherOptions.forEach((option) => {
								option.element.classList.remove('zyro-ecwid__hidden');
							});
						}

						const filterOther = otherFilterHTML;

						if (otherOptions.length) {
							radioSection.querySelector('.zyro-ecwid__search').insertAdjacentHTML('afterbegin', filterOther);
							radioSection.querySelector('#filter-other').addEventListener('input', (event) => {
								if (event.target.checked) {
									otherOptions[0].element.click();
									ecwidRadioDeliveryWrapper.classList.add('zyro-ecwid__loading');

									setTimeout(() => {
										dataOptions.forEach((option) => {
											option.element.classList.add('zyro-ecwid__hidden');
										});
										otherOptions.forEach((option) => {
											option.element.classList.remove('zyro-ecwid__hidden');
										});
										ecwidRadioDeliveryWrapper.classList.remove('zyro-ecwid__loading');
									}, 300);

									ecwidRadioDeliveryWrapper.scroll(otherOptions[0].element.offsetTop, 0);
								}
							});
						}

						const filterLPExpress = lpExpressFilterHtml;

						if (LPExpressOptions.length) {
							radioSection.querySelector('.zyro-ecwid__search').insertAdjacentHTML('afterbegin', filterLPExpress);
							radioSection.querySelector('#filter-lpexpress').addEventListener('input', (event) => {
								if (event.target.checked) {
									LPExpressOptions[0].element.click();
									ecwidRadioDeliveryWrapper.classList.add('zyro-ecwid__loading');

									setTimeout(() => {
										dataOptions.forEach((option) => {
											option.element.classList.add('zyro-ecwid__hidden');
										});
										LPExpressOptions.forEach((option) => {
											option.element.classList.remove('zyro-ecwid__hidden');
										});
										ecwidRadioDeliveryWrapper.classList.remove('zyro-ecwid__loading');
									}, 300);
								}

								ecwidRadioDeliveryWrapper.scroll(LPExpressOptions[0].element.offsetTop, 0);
							});
						}

						const filterOmniva = omnivaFilterHtml;

						if (OmnivaOptions.length) {
							radioSection.querySelector('.zyro-ecwid__search').insertAdjacentHTML('afterbegin', filterOmniva);
							radioSection.querySelector('#filter-omniva').addEventListener('input', (event) => {
								if (event.target.checked) {
									OmnivaOptions[0].element.click();
									ecwidRadioDeliveryWrapper.classList.add('zyro-ecwid__loading');

									setTimeout(() => {
										dataOptions.forEach((option) => {
											option.element.classList.add('zyro-ecwid__hidden');
										});
										OmnivaOptions.forEach((option) => {
											option.element.classList.remove('zyro-ecwid__hidden');
										});
										ecwidRadioDeliveryWrapper.classList.remove('zyro-ecwid__loading');
									}, 300);

									ecwidRadioDeliveryWrapper.scroll(OmnivaOptions[0].element.offsetTop, 0);
								}
							});
						}

						ecwidRadioDeliveryOptions.addEventListener('click', (event) => {
							if (event.target.closest('.ec-radiogroup__item')) {
								const isOmniva = event.target.closest('.ec-radiogroup__item').innerText.includes('Omniva');
								const isLPExpress = event.target.closest('.ec-radiogroup__item').innerText.includes('LPExpress');

								if (isOmniva) {
									radioSection.querySelector('#filter-omniva').checked = true;
								} else if (isLPExpress) {
									radioSection.querySelector('#filter-lpexpress').checked = true;
								} else {
									radioSection.querySelector('#filter-omniva').checked = false;
									radioSection.querySelector('#filter-lpexpress').checked = false;
								}
							}
						});

						if (selectedOption.isOmniva) {
							radioSection.querySelector('#filter-omniva').checked = true;
						}

						if (selectedOption.isLPExpress) {
							radioSection.querySelector('#filter-lpexpress').checked = true;
						}

						if (selectedOption.isOther) {
							radioSection.querySelector('#filter-other').checked = true;
						}

						ecwidRadioDeliveryWrapper.scroll(selectedOption.element.offsetTop, 0);
					}
				}
			}
		}, ms); // check every Xms
	},
};
