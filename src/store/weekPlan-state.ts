import moment from 'moment';
moment.updateLocale('en', {
    week: {
        dow: 1,
    },
});

export const weekDays = moment.weekdaysShort();

export const fakeWeekPlans = [
    {
        name: 'Fake Week Plan1',
        dailyPlans: [
            {
                lunch: 'Lunch 1-1',
            },
            {
                lunch: 'Lunch 1-2',
                dinner: 'dinner 1-2',
            },
            {
                lunch: 'Lunch 1-3',
            },
            {
                dinner: 'dinner 1-4',
            },
            {
                lunch: 'Lunch 1-5',
                dinner: 'dinner 1-5',
            },
            {},
            {},
        ],
        author: 'Pep',
    },
    {
        name: 'Fake Week Plan2',
        dailyPlans: [
            {},
            {
                dinner: 'dinner 2-2',
            },
            {
                dinner: 'dinner 2-3',
            },
            {
                dinner: 'dinner 2-4',
            },
            {
                lunch: 'lunch 2-5',
                dinner: 'dinner 2-5',
            },
            {},
            {},
        ],
        author: 'Pep',
    },
    {
        name: 'Fake Week Plan3',
        dailyPlans: [
            {
                lunch: 'Lunch 3-1',
                dinner: 'dinner 3-1',
            },
            {
                lunch: 'Lunch 3-2',
            },
            {
                lunch: 'Lunch 3-3',
            },
            {
                lunch: 'lunch 3-4',
                dinner: 'dinner 3-4',
            },
            {},
            {},
            {},
        ],
        author: 'Pep',
    },
];

export const newWeekPlan = {
    name: 'New Week Plan',
    dailyPlans: [{}, {}, {}, {}, {}, {}, {}],
    author: 'Pep',
};
