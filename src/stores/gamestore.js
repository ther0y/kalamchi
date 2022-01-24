import {writable} from 'svelte/store';

export const GameState = {
	PENDING: 'PENDING',
	LOADING: 'LOADING',
	IN_PROGRESS: 'IN_PROGRESS',
	FINISHED: 'FINISHED'
};

export const GameStore = writable({
	state: GameState.IN_PROGRESS,
	date: Date.now(),
	word: {
		value: '',
		guessCount: 6
	},
	guesses: [{
		guess: '',
		segments: []
	}],
	guessIndex: 0
});
