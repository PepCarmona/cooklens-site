const backend = {
    local: '//localhost:4000',
    production: 'https://cooklens.herokuapp.com',
};

const proxy = backend.local;

export const URI = {
    recipes: {
        get: `${proxy}/recipes/get`,
        add: `${proxy}/recipes/add`,
        update: `${proxy}/recipes/update`,
        delete: `${proxy}/recipes/delete`,
    },
};
