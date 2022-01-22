// const fetchWordMeanings = async () => {}

import { Base64 } from '../utils/Base64';
import { writable } from 'svelte/store';

export const fetchActiveWord = async () => {
	const response = await fetch('/api/word');
	const data = response.text();
	return data;
};

export const setWord = async () => {
	try {
		const data = await fetchActiveWord();
		Word.set(JSON.parse(Base64.decode(Base64.decode(data))));
	} catch (err) {
		console.log(err);
	}
};

export let Word = writable({
	value: '',
	guessCount: 5
});
