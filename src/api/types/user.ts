export interface User {
    _id?: string;
    username: string;
    password: string;
    email?: string;
    favRecipes?: string[];
}

export class UserClass implements User {
    username: string;
    password: string;
    email?: string;
    favRecipes?: string[];
    constructor() {
        this.username = '';
        this.password = '';
    }
}
