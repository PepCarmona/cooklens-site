interface RecipeTime {
    preparation?: number;
    cooking: number;
}

interface Ingredient {
    _id?: string;
    quantity: number;
    units: string;
    name: string;
}

interface Step {
    _id?: string;
    position: number;
    content: string;
}
export interface Recipe {
    _id?: string;
    title: string;
    description?: string;
    time: RecipeTime;
    servings: number;
    ingredients: Ingredient[];
    instructions: Step[];
    tags: string[];
}

export class RecipeClass implements Recipe {
    title: string;
    description: string;
    time: RecipeTime;
    servings: number;
    ingredients: Ingredient[];
    instructions: Step[];
    tags: string[];
    constructor() {
        this.title = '';
        this.description = '';
        this.time = {
            cooking: 0,
        };
        this.servings = 4;
        this.ingredients = [];
        this.instructions = [];
        this.tags = [];
    }
}

// export const FakeRecipes: Recipe[] = [
//     {
//         _id: '1',
//         title: 'first title',
//         body: 'body body body body body body',
//     },
//     {
//         _id: '2',
//         title: 'second title',
//         body: 'body body body body body body',
//     },
//     {
//         _id: '3',
//         title: 'third title',
//         body: 'body body body body body body',
//     },
//     {
//         _id: '4',
//         title: 'fourth title',
//         body: 'body body body body body body',
//     },
// ];
