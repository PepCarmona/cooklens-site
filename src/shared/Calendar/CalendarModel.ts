import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

import { Week, WeekDay } from './CalendarTypes';

export function getEmptyWeek(): Week {
    return [null, null, null, null, null, null, null];
}

export function getWeek(day: Date) {
    const week: Week = getEmptyWeek();
    const weekStart = dayjs(day).startOf('isoWeek');

    for (let i = 0; i < 7; i++) {
        const day = dayjs(weekStart).add(i, 'days');
        week[i] = new WeekDay(day.toDate());
    }

    return week;
}
