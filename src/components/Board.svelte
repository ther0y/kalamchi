<script>
	import JSConfetti from 'js-confetti';
	import { Notyf } from 'notyf';
	import 'notyf/notyf.min.css'; // for React, Vue and Svelte
	import { GameState, GameStore } from '../stores/gamestore.js';
	import CharacterInput from './CharacterInput.svelte';
	import { browser } from '$app/env';
	import Spinner from './Spinner.svelte';

	let jsConfetti = null;
	let notyf = null;
	let hiddenInput = null;

	if (browser) {
		hiddenInput = document.getElementById('hidden-input');
		jsConfetti = new JSConfetti();
		notyf = new Notyf({
			duration: 800,
			ripple: false,
			position: {
				x: 'center',
				y: 'center'
			},
			types: [
				{
					type: 'success',
					icon: false,
					background: '#fff',
					className: 'success-notyf'
				}
			],
			dismissible: false
		});
	}

	let isLoading = false;
	$: word = $GameStore.word;
	$: isFinished = $GameStore.state === GameState.FINISHED;
	$: gridColumnsCount = $GameStore.word.value?.length;
	let wordChars = [];
	$: guessIndex = $GameStore.guessIndex;
	$: currentGuess = $GameStore.guesses[$GameStore.guessIndex];

	$: {
		wordChars = $GameStore.word.value?.split('').map((char, id) => ({
			id,
			char
		}));
	}

	let processing = false;
	let hasGuessedWrong = false;

	const shake = () =>
		new Promise((resolve) => {
			hasGuessedWrong = true;

			setTimeout(() => {
				hasGuessedWrong = false;
				resolve();
			}, 250);
		});

	const handleKeydown = async ({ key }) => {
		if (!isFinished) {
			const isGuessFilled = currentGuess.guess.length === $GameStore.word.value.length;

			if (!processing && key === 'Enter') {
				processing = true;

				try {
					if (isGuessFilled) {
						if ($GameStore.word.value === currentGuess.guess) {
							hiddenInput && hiddenInput.blur();
							jsConfetti.addConfetti();
							$GameStore.state = GameState.FINISHED;
							processing = false;
						} else {
							const hasMoreGuess = guessIndex < $GameStore.word.guessCount - 1;
							isLoading = true;
							const response = await fetch(`/api/word/${currentGuess.guess}`);
							const data = await response.json();
							isLoading = false;

							if (data?.count) {
								if (hasMoreGuess) {
									await shake();
									processing = false;
									$GameStore.guessIndex += 1;
								} else {
									$GameStore.state = GameState.FINISHED;
									processing = false;
								}
							} else {
								notyf.success('همچین کلمه‌ای نداریم!');
								await shake();
								processing = false;
							}
						}
					} else {
						await shake();
						processing = false;
					}
				} catch (e) {
					console.error(e);
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

			$GameStore = {
				...$GameStore,
				guesses: $GameStore.guesses.map((g, index) => {
					if (index === guessIndex) return currentGuess;
					return g;
				})
			};
		}
	};

	const isValidInput = (input) => {
		const persianLetters = /^[\u0600-\u06FF]$/;
		return input.match(persianLetters);
	};

	const openVirtualKeyboard = () => {
		!isFinished && hiddenInput && hiddenInput.focus();
	};
</script>

<svelte:window on:keydown={handleKeydown} />

<input type="text" id="hidden-input" style="opacity: 0" />
<div class="board" style="grid-template-columns: repeat({gridColumnsCount}, 60px);">
	{#each $GameStore.guesses as ag, index}
		<div class="row-wrapper">
			<div class:active={index === guessIndex && !isFinished} class="indicator">
				<!--					<img src="images/cabbage.png" alt="kalam!" height="30" />-->
				🥦
			</div>
			<div class="row" class:shake={index === guessIndex && hasGuessedWrong}>
				{#each wordChars as w, charIndex (w.id)}
					<span on:click={openVirtualKeyboard}>
						<CharacterInput
							bind:char={ag.segments[w.id]}
							index={charIndex}
							guess={ag.guess}
							shouldBe={word.value[charIndex]}
							disabled={index < guessIndex || isFinished}
						/>
					</span>
				{/each}
			</div>
			<Spinner show={isLoading && index === guessIndex} />
		</div>
	{/each}
</div>

<style>
	.board {
		margin: 32px 0;
	}

	#hidden-input {
		position: fixed;
		opacity: 0;
	}

	span {
		display: inline-flex;
		margin: auto;
	}

	.row-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}

	.indicator {
		border-radius: 100%;
		visibility: hidden;
		display: flex;
		padding-top: 7px;
		font-size: 24px;
		align-items: center;
	}

	.indicator.active {
		visibility: visible;
	}

	.row {
		display: flex;
		gap: 8px;
		margin: 4px 0;
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
