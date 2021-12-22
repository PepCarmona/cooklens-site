const backend = {
	local: 'http://localhost:4000',
	production: 'https://cooklens.herokuapp.com',
};

const proxy =
	window.location.host.indexOf('localhost') > -1
		? backend.local
		: backend.production;

export const URI = {
	recipes: {
		get: `${proxy}/recipes/get`,
		getById: `${proxy}/recipes/getById`,
		getRandom: `${proxy}/recipes/getRandom`,
		getByUser: `${proxy}/recipes/getByUser`,
		add: `${proxy}/recipes/add`,
		update: `${proxy}/recipes/update`,
		delete: `${proxy}/recipes/delete`,
		import: `${proxy}/recipes/import`,
		integratedSites: `${proxy}/recipes/integrated-sites`,
	},
	auth: {
		register: `${proxy}/auth/signup`,
		verify: `${proxy}/auth/verifyUser`,
		login: `${proxy}/auth/signin`,
		loginFromToken: `${proxy}/auth/signinFromToken`,
	},
	user: {
		addFavRecipe: `${proxy}/user/addFavRecipe`,
		removeFavRecipe: `${proxy}/user/removeFavRecipe`,
		getFavRecipes: `${proxy}/user/getFavRecipes`,
	},
	mealPlan: {
		get: `${proxy}/mealPlan/getMealPlan`,
		update: `${proxy}/mealPlan/updateMealPlan`,
	},
};
