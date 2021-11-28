export default {
	namespaced: true,
	state: {
		// Only user full name is stored inside user object, because other data is unused in user build.
		user: null,
	},
	mutations: {
		setUser: (state, user) => {
			state.user = user;
		},
	},
};
