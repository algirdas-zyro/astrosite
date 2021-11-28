import { ref } from 'vue-demi';

const openModalComponent = ref(false);

export const useModal = () => {
	const openModal = ({
		name,
		path = './',
	}) => {
		openModalComponent.value = name ? () => import(/* @vite-ignore */ `${path}${name}.vue`) : null;
	};

	const closeModal = () => {
		openModalComponent.value = null;
	};

	return {
		openModal,
		closeModal,
		openModalComponent,
	};
};
