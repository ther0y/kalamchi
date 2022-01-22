<script>
	import { browser } from '$app/env';
	import { setWord, Word } from '../stores/gamestore';

	if (browser) {
		setWord();
	}

	import CharachterInput from '../components/CharachterInput.svelte';

	let wordChars = $Word.value.split('').map((char, id) => ({
		id,
		char
	}));
	let guessIndex = 0;
	let finsihed = false;
	let hasGuessedWrong = false;

	let allowedGusses = Array($Word.guessCount)
		.fill('')
		.map((_) => ({
			guess: '',
			segments: []
		}));

	$: {
		wordChars = $Word.value.split('').map((char, id) => ({
			id,
			char
		}));
		guessIndex = 0;
		finsihed = false;
		hasGuessedWrong = false;

		allowedGusses = Array($Word.guessCount)
			.fill('')
			.map((_) => ({
				guess: '',
				segments: []
			}));
	}

	const handleKeydown = async ({ key }) => {
		let currentGuess = allowedGusses[guessIndex];
		const isGuessFilled = currentGuess.guess.length === $Word.value.length;

		if (key === 'Enter') {
			if (isGuessFilled) {
				const hasMoreGuess = guessIndex < allowedGusses.length - 1;
				const response = await fetch(`/api/word/${currentGuess.guess}`);
				const data = await response.json();

				if (data?.count) {
					if ($Word.value === currentGuess.guess || !hasMoreGuess) {
						finsihed = true;
					} else if (hasMoreGuess) {
						hasGuessedWrong = true;

						setTimeout(() => {
							hasGuessedWrong = false;
							guessIndex += 1;
							currentGuess = {
								guess: '',
								segments: []
							};
						}, 250);
					}
				} else {
					hasGuessedWrong = true;

					setTimeout(() => {
						hasGuessedWrong = false;
					}, 250);
				}
			}
		}

		if (!isGuessFilled && isValidInput(key)) {
			currentGuess.guess = currentGuess.guess + key;
			currentGuess.segments = currentGuess.guess.split('');
		}

		if (key === 'Backspace') {
			currentGuess.guess = currentGuess.guess.slice(0, -1);
			currentGuess.segments = currentGuess.guess.split('');
		}

		allowedGusses[guessIndex] = currentGuess;
	};

	const isValidInput = (input) => {
		const letters = /^[A-Za-z]$/;
		const persianLetters = /^[\u0600-\u06FF]$/;
		return input.match(persianLetters);
	};
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
	<title>Kalamchi | کلمچی</title>
	<link
		href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css"
		rel="stylesheet"
		type="text/css"
	/>
</svelte:head>

<main>
	<div class="board" style="grid-template-columns: repeat({$Word.value.length}, 60px);">
		{#each allowedGusses as ag, index}
			<div class="row" class:shake={index === guessIndex && hasGuessedWrong}>
				{#each wordChars as w, charIndex (w.id)}
					<CharachterInput
						bind:char={ag.segments[w.id]}
						index={charIndex}
						guess={ag.guess}
						shouldBe={$Word.value[charIndex]}
						disabled={index < guessIndex || finsihed}
					/>
				{/each}
			</div>
		{/each}
	</div>
</main>

<style>
	main {
		direction: rtl;
		box-sizing: border-box;
		text-align: center;
		padding: 1em;
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.board {
		/* display: grid;
      margin: 0 auto;
      grid-gap: 8px; */
	}

	.row {
		display: flex;
		gap: 8px;
		margin: 8px 0;
	}

	.shake {
		animation: shake 0.25s;
	}

	@keyframes shake {
		0% {
			transform: translateX(-4px);
		}
		30% {
			transform: translateX(4px);
		}
		50% {
			transform: translateX(-4px);
		}
		70% {
			transform: translateX(4px);
		}
		100% {
			transform: translateX(0px);
		}
	}
</style>
