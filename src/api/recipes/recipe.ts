export interface Recipe {
    _id?: string;
    title: string;
    body: string;
}

export const FakeRecipes: Recipe[] = [
    {
        _id: '1',
        title: 'first title',
        body: 'body body body body body body',
    },
    {
        _id: '2',
        title: 'second title',
        body: 'body body body body body body',
    },
    {
        _id: '3',
        title: 'third title',
        body: 'body body body body body body',
    },
    {
        _id: '4',
        title: 'fourth title',
        body: 'body body body body body body',
    },
];
