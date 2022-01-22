<script>
	import CharachterInput from '../components/CharachterInput.svelte';
	let word = 'نیران';
	let wordChars = word.split('').map((char, id) => ({
		id,
		char
	}));

	let finsihed = false;

	let hasGuessedWrong = false;

	const allowedGusses = Array(5)
		.fill('')
		.map((_) => ({
			guess: '',
			segments: []
		}));

	let guessIndex = 0;

	const handleKeydown = ({ key }) => {
		let currentGuess = allowedGusses[guessIndex];
		const isGuessFilled = currentGuess.guess.length === word.length;

		if (key === 'Enter') {
			const hasMoreGuess = guessIndex < allowedGusses.length - 1;

			if (isGuessFilled && word === currentGuess.guess) {
				finsihed = true;
			} else if (isGuessFilled && hasMoreGuess) {
				hasGuessedWrong = true;

				setTimeout(() => {
					hasGuessedWrong = false;
				}, 250);

				guessIndex += 1;
				currentGuess = {
					guess: '',
					segments: []
				};
			}

			if (isGuessFilled && !hasMoreGuess) {
				finsihed = true;
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
	<link
		href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css"
		rel="stylesheet"
		type="text/css"
	/>
</svelte:head>

<main>
	<div class="board" style="grid-template-columns: repeat({word.length}, 60px);">
		{#each allowedGusses as ag, index}
			<div class="row" class:shake={index === guessIndex - 1 && hasGuessedWrong}>
				{#each wordChars as w, charIndex (w.id)}
					<CharachterInput
						bind:char={ag.segments[w.id]}
						index={charIndex}
						guess={ag.guess}
						{word}
						shouldBe={word[charIndex]}
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
		50% {
			transform: translateX(4px);
		}
		100% {
			transform: translateX(0px);
		}
	}
</style>
