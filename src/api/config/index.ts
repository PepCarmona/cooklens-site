const backend = {
	local: 'http://localhost:4000/api',
	production: `${location.origin}/api`,
};

const apiUrl =
	window.location.host.indexOf('localhost') > -1
		? backend.local
		: backend.production;

export const URI = {
	recipes: {
		get: `${apiUrl}/recipes/get`,
		getById: `${apiUrl}/recipes/getById`,
		getRandom: `${apiUrl}/recipes/getRandom`,
		getByUser: `${apiUrl}/recipes/getByUser`,
		add: `${apiUrl}/recipes/add`,
		update: `${apiUrl}/recipes/update`,
		delete: `${apiUrl}/recipes/delete`,
		import: `${apiUrl}/recipes/import`,
		integratedSites: `${apiUrl}/recipes/integrated-sites`,
	},
	auth: {
		register: `${apiUrl}/auth/signup`,
		verify: `${apiUrl}/auth/verifyUser`,
		login: `${apiUrl}/auth/signin`,
		loginFromToken: `${apiUrl}/auth/signinFromToken`,
	},
	user: {
		addFavRecipe: `${apiUrl}/user/addFavRecipe`,
		removeFavRecipe: `${apiUrl}/user/removeFavRecipe`,
		getFavRecipes: `${apiUrl}/user/getFavRecipes`,
	},
	mealPlan: {
		get: `${apiUrl}/mealPlan/getMealPlan`,
		update: `${apiUrl}/mealPlan/updateMealPlan`,
	},
};
