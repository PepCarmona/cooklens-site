const backend = {
    local: 'http://localhost:4000',
    production: 'https://cooklens.herokuapp.com',
};

const proxy =
    process.env.VUE_APP_API === 'local' ? backend.local : backend.production;

export const URI = {
    recipes: {
        get: `${proxy}/recipes/get`,
        add: `${proxy}/recipes/add`,
        update: `${proxy}/recipes/update`,
        delete: `${proxy}/recipes/delete`,
        import: `${proxy}/recipes/import`,
        integratedSites: `${proxy}/recipes/integrated-sites`,
        search: `${proxy}/recipes/search`,
    },
    auth: {
        register: `${proxy}/auth/signup`,
        login: `${proxy}/auth/signin`,
    },
    user: {
        addFavRecipe: `${proxy}/user/addFavRecipe`,
        removeFavRecipe: `${proxy}/user/removeFavRecipe`,
        getFavRecipes: `${proxy}/user/getFavRecipes`,
    },
};
