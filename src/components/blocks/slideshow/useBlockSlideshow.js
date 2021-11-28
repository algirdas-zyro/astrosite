import {
	ref,
	computed,
	watch,
} from 'vue-demi';

export const DIRECTION_LEFT = 'left';
export const DIRECTION_RIGHT = 'right';

const activeSlides = ref({});
const activeSlidesSlidingDirection = ref({});
const activeSlidesTransitioning = ref({});
const fixedBackgroundImageStyle = ref({});
const slideshowRef = ref(null);

export const useBlockSlideshow = (props) => {
	const slideshowSettings = computed(() => props.data.settings);

	const slides = computed(() => props.data.slides.map((slide) => {
		const blockGridData = props.blocks[slide.blockId];

		// Slideshow slides block styles are overridden with slideshow block styles here as all slides have to have the same style
		return {
			...slide,
			data: {
				...blockGridData,
				settings: {
					...blockGridData.settings,
					styles: {
						...props.data.settings.styles,
						attachment: blockGridData.settings.styles.attachment,
					},
				},
			},
		};
	}));

	const currentSlideIndex = computed(
		() => {
			const activeSlideIndex = props.data.slides.findIndex(
				(slide) => activeSlides?.value?.[props.blockId] === slide.blockId,
			);

			return activeSlideIndex === -1 ? 0 : activeSlideIndex;
		},
	);

	const slidesCount = computed(() => slides.value.length);

	const nextSlideIndex = computed(() => {
		const nextIndex = currentSlideIndex.value + 1;

		return nextIndex <= slidesCount.value - 1 ? nextIndex : 0;
	});

	const previousSlideIndex = computed(() => {
		const previousIndex = currentSlideIndex.value - 1;

		return previousIndex >= 0 ? previousIndex : slidesCount.value - 1;
	});

	const isNextSlideNavigationVisible = computed(() => {
		if (slideshowSettings.value.isLoopEnabled) {
			return true;
		}

		return !(!slideshowSettings.value.isLoopEnabled
				&& currentSlideIndex.value === slidesCount.value - 1);
	});

	const isPreviousSlideNavigationVisible = computed(() => {
		if (slideshowSettings.value.isLoopEnabled) {
			return true;
		}

		return !(!slideshowSettings.value.isLoopEnabled
				&& currentSlideIndex.value === 0);
	});

	const currentSlidingDirection = computed(() => activeSlidesSlidingDirection.value[props.blockId]);

	const isSlideshowTransitioning = computed(
		() => activeSlidesTransitioning.value[props.blockId],
	);

	const setIsSlideTransitioning = (value) => {
		activeSlidesTransitioning.value = {
			...activeSlidesTransitioning.value,
			[props.blockId]: value,
		};
	};

	const setIsSlideTransitioningFalseAfterMs = (ms) => {
		setTimeout(() => {
			setIsSlideTransitioning(false);
		}, ms);
	};

	const removeActiveSlide = (slideshowId) => {
		delete activeSlides.value[slideshowId];
	};

	const setActiveSlide = ({
		slideshowId,
		slideId,
	}) => {
		setIsSlideTransitioning(true);
		activeSlides.value = {
			...activeSlides.value,
			[slideshowId]: slideId,
		};
		setIsSlideTransitioning(false);
	};

	const setActiveSlideByIndex = (index) => {
		setActiveSlide({
			slideshowId: props.blockId,
			slideId: props.data.slides[index].blockId,
		});
	};

	const setSlidingDirection = (direction) => {
		activeSlidesSlidingDirection.value = {
			...activeSlidesSlidingDirection.value,
			[props.blockId]: direction,
		};
	};

	const goToSlide = (index, isIndicatorClick = true) => {
		if (isSlideshowTransitioning.value) {
			return;
		}

		if (currentSlideIndex.value < index && isIndicatorClick) {
			setSlidingDirection(DIRECTION_RIGHT);
		} else if (currentSlideIndex.value > index && isIndicatorClick) {
			setSlidingDirection(DIRECTION_LEFT);
		}

		setActiveSlideByIndex(index);
	};

	const goToNextSlide = () => {
		setSlidingDirection(DIRECTION_RIGHT);
		goToSlide(nextSlideIndex.value, false);
	};

	const goToPreviousSlide = () => {
		setSlidingDirection(DIRECTION_LEFT);
		goToSlide(previousSlideIndex.value, false);
	};

	watch(isSlideshowTransitioning, (isTransitioning) => {
		if (!isTransitioning || !slideshowRef.value) {
			return;
		}

		const {
			top,
			left,
		} = slideshowRef.value.$el.getBoundingClientRect();

		// This is only needed while tansitioning slides with fixed backgrounds. See Slide.vue
		fixedBackgroundImageStyle.value = {
			'--fixedImage-top': `${-top}px`,
			'--fixedImage-left': `${-left}px`,
		};
	});

	return {
		slideshowSettings,
		isSlideshowTransitioning,
		activeSlidesTransitioning,
		activeSlides: computed(() => activeSlides.value),
		currentSlideIndex,
		currentSlidingDirection,
		slides,
		slidesCount,
		nextSlideIndex,
		previousSlideIndex,
		isNextSlideNavigationVisible,
		isPreviousSlideNavigationVisible,
		removeActiveSlide,
		setIsSlideTransitioning,
		setActiveSlide,
		setActiveSlideByIndex,
		setIsSlideTransitioningFalseAfterMs,
		setSlidingDirection,
		goToSlide,
		goToNextSlide,
		goToPreviousSlide,
		slideshowRef,
		fixedBackgroundImageStyle,
	};
};
