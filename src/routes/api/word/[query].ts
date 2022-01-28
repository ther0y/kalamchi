import { fetchWordMeanings } from './vajeyab';

const wordsCache = {};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function get({ params }) {
	try {
		if (wordsCache[params.query]) return wordsCache[params.query];

		const { response, status } = (await fetchWordMeanings(params.query)) as {response: unknown, status: number};

		wordsCache[params.query] = {
			status,
			body: response
		};

		return wordsCache[params.query];
	} catch ({ message, status }) {
		return {
			status,
			body: message
		};
	}
}
