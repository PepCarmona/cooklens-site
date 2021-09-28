export interface User {
    username: string;
    password: string;
    email?: string;
}

export class UserClass implements User {
    username: string;
    password: string;
    email?: string;
    constructor() {
        this.username = '';
        this.password = '';
    }
}
