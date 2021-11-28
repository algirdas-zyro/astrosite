<template>
	<div
		class="loader"
	/>
</template>

<style lang="scss" scoped>
.loader {
	--default-size: 40px;
	--default-border-color: var(--light);
	--default-weight: 4px;
	--default-color: var(--dark);
	--default-border: 4px;

	display: flex;
	width: var(--size, var(--default-size));
	height: var(--size, var(--default-size));
	margin: auto;
	border:
		var(--border, var(--default-border))
		solid var(--border-color, var(--default-border-color));
	border-top: var(--weight, var(--default-weight)) solid var(--color, var(--default-color));
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
