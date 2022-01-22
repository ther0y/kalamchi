import { fetchWordMeanings } from './vajeyab';

const wordsCache = {};

export async function get({ params }) {
	try {
		if (wordsCache[params.query]) return wordsCache[params.query];

		const { response, status } = (await fetchWordMeanings(params.query)) as any;

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
