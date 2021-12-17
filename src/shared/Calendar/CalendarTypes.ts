import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

import { weekdays, weekdaysShort } from '@/helpers/date';

import { Day } from 'cooklens-types';

export class WeekDay implements Day {
	month: string;
	dayNumber: string;
	dayNameShort: string;
	dayNameLong: string;
	weekday: number;
	isBeforeToday: boolean;
	date: string;
	unformattedDate: Date;

	constructor(_day: Date) {
		const day = dayjs(_day);

		this.month = day.format('MMMM');
		this.dayNumber = day.format('D');
		this.dayNameShort = weekdaysShort[day.isoWeekday() - 1];
		this.dayNameLong = weekdays[day.isoWeekday() - 1];
		this.date = day.format('M-DD-YYYY');
		this.isBeforeToday = day.startOf('day').isBefore(dayjs().startOf('day'));
		this.weekday = day.isoWeekday();
		this.unformattedDate = day.toDate();
	}
}
