import { format, getHours } from 'date-fns';
import { Base64 } from '../../../utils/Base64';
import { Words } from '../../../utils/words';

const roundHour = (hour, roundBy) => {
	return roundBy * Math.floor(hour / roundBy);
};

const now = Date.now();
const hour = roundHour(getHours(now), 8);
const formatedNow = format(now, `yy/MM/dd-${hour > 10 ? hour : '0' + hour}:00`);

export const currentWord = Base64.encode(Base64.encode(JSON.stringify(Words[formatedNow])));

export async function get(): Promise<{status: number, body: unknown}> {
	return {
		status: 200,
		body: currentWord
	};
}
