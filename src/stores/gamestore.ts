import {writable} from 'svelte/store';
import {LsBox} from "../encryoted-localstorage";
import {LsNames} from "../ls-names";
import {browser} from "$app/env";

export const GameState = {
	PENDING: 'PENDING',
	LOADING: 'LOADING',
	IN_PROGRESS: 'IN_PROGRESS',
	FINISHED: 'FINISHED'
};

const gameIdBox = LsBox(LsNames.GAME_ID);
export const stateBox = LsBox(LsNames.STATE)

export const GameId = writable(gameIdBox.get());
GameId.subscribe(gid => gameIdBox.set(gid))

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

export const InitGame = (gameData) => {
	const savedState = JSON.parse(stateBox.get());
	GameStore.set({...gameData, ...savedState});
}