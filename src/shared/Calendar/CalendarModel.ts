import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

import {
    Calendar,
    CalendarBoundaries,
    Day,
    Week,
    WeekDay,
} from './CalendarTypes';

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

export function getCalendar(
    boundaries?: CalendarBoundaries,
    selectedDay?: Day
) {
    const startDate = boundaries?.startDate ?? Date.now();
    const endDate =
        boundaries?.endDate ??
        dayjs(startDate)
            .add(boundaries?.duration ?? 730, 'days')
            .toDate();

    const monthsDifference =
        dayjs(endDate).diff(dayjs(startDate), 'months') + 1;

    const calendar: Calendar = [];

    for (let i = 0; i <= monthsDifference; i++) {
        const date = dayjs(startDate).add(i, 'months');
        const month = date.month();
        const year = date.year();
        const daysInMonth = dayjs().month(month).daysInMonth();

        const weeks: Week[] = [];
        let week: Week = getEmptyWeek();

        let isInView = false;

        for (let j = 1; j <= daysInMonth; j++) {
            const day = date.date(j);
            if (day.isBefore(dayjs(startDate)) || day.isAfter(dayjs(endDate))) {
                continue;
            }

            if (day.isSame(dayjs(selectedDay?.date))) {
                isInView = true;
            }

            const weekday = day.isoWeekday() - 1;
            week[weekday] = new WeekDay(day.toDate());

            if (weekday === 6 || j === daysInMonth) {
                weeks.push(week);
                week = getEmptyWeek();
            }
        }

        calendar.push({
            monthNumber: month,
            monthName: date.format('MMMM'),
            year,
            weeks,
            isInView,
        });
    }

    return calendar;
}
