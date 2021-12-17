export const roles = ['admin', 'user', 'guest'] as const;
export type Role = typeof roles[number];

export const status = ['active', 'pending'] as const;
export type Status = typeof status[number];

export interface UserInfo {
    _id?: string;
    username: string;
    email: string;
    password: string;
    role: Role;
    status: Status;
    confirmationCode: string;
    favRecipes?: string[];
}

export class User implements UserInfo {
    username = '';
    email = '';
    password = '';
    role: Role = 'user';
    status: Status = 'pending';
    confirmationCode = '';
    favRecipes?: string[];
}
