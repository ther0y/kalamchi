<script>
	import {GameStore} from '../stores/gamestore';

	export let char = '';
	export let disabled = false;
	export let index = 0;
	export let guess = '';
	export let shouldBe = '';
	export let sample = false;
	export let state = '';

	$: word = $GameStore.word.value;
	$: remainings = word
		.split('')
		.map((w, index) => {
			if (w === guess[index]) return '/';
			return w;
		})
		.join('');

	$: correct = (sample && state === 'correct') || disabled && char && word.includes(char) && shouldBe === char;
	$: contains = (sample && state === 'contains') ||
		disabled &&
		char &&
		shouldBe !== char &&
		remainings.includes(char) &&
		guess.indexOf(char) === index;
</script>

<div class:sample class:bang={char} class:correct class:contains class:disabled class="input">
	{char || ''}
</div>

<style>
	.input {
		background-color: #333;
		text-transform: capitalize;
		border: 2px solid rgb(182, 182, 182);
		transition: all 0.25s;
		border-radius: 6px;
		width: 60px;
		height: 60px;
		margin: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		font-weight: bold;
		box-sizing: border-box;
		padding: 0;
		color: white;
		user-select: none;
	}

	@media screen and (max-width: 480px) {
		.input {
			width: 45px;
			height: 45px;
		}
	}

	.sample {
		width: 32px !important;
		height: 32px !important;
		font-size: 18px;
	}

	.bang {
		animation: bang 0.25s;
		border: 2px solid white;
		transition: all 0.25s;
	}

	.disabled {
		border-color: transparent;
		transition: all 0.25s;
	}

	.correct {
		background: #538d4e;
	}

	.contains {
		background: #b59f3b;
	}

	@keyframes bang {
		0% {
			transform: scale(1);
		}
		30% {
			transform: scale(1.07);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
