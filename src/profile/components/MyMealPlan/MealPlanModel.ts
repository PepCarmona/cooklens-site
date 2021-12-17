import dayjs from 'dayjs';

import { Week } from '@/shared/Calendar/CalendarTypes';
import { getWeek } from '@/shared/Calendar/CalendarModel';

export const NUMBER_OF_FUTURE_WEEKS = 52;
export const NUMBER_OF_PAST_WEEKS = 52; // TODO: start on registration date

export function getWeeks() {
	const weeks: Week[] = [];

	for (let i = 0; i < NUMBER_OF_FUTURE_WEEKS + NUMBER_OF_PAST_WEEKS; i++) {
		weeks.push(
			getWeek(
				dayjs()
					.add(i - NUMBER_OF_PAST_WEEKS, 'weeks')
					.toDate()
			)
		);
	}

	return weeks;
}
