interface RecipeTime {
    preparation?: number;
    cooking: number;
}

export interface Ingredient {
    _id?: string;
    quantity: number;
    units?: string;
    name: string;
}

export interface Step {
    _id?: string;
    position: number;
    content: string;
}

export interface Tag {
    _id?: string;
    value: string;
}
export interface Recipe {
    _id?: string;
    title: string;
    description?: string;
    time: RecipeTime;
    servings: number;
    ingredients: Ingredient[];
    instructions: Step[];
    tags: Tag[];
}

export class IngredientClass implements Ingredient {
    quantity: number;
    units: string;
    name: string;
    constructor() {
        this.quantity = 1;
        this.units = '';
        this.name = '';
    }
}

export class StepClass implements Step {
    position: number;
    content: string;
    constructor() {
        this.position = 0;
        this.content = '';
    }
}

export class TagClass implements Tag {
    value: string;
    constructor() {
        this.value = '';
    }
}

export class RecipeClass implements Recipe {
    title: string;
    description: string;
    time: RecipeTime;
    servings: number;
    ingredients: Ingredient[];
    instructions: Step[];
    tags: Tag[];
    constructor() {
        this.title = '';
        this.description = '';
        this.time = {
            preparation: 0,
            cooking: 5,
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
