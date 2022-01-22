<script>
	export let char = '';
	export let disabled = false;
	export let index = 0;
	export let word = '';
	export let guess = '';
	export let shouldBe = '';

	$: remainings = word
		.split('')
		.map((w, index) => {
			if (w === guess[index]) return '/';
			return w;
		})
		.join('');

	$: correct = disabled && char && word.includes(char) && shouldBe === char;
	$: contains = disabled && char && shouldBe !== char && remainings.includes(char);
</script>

<div class:d={char} class:correct class:contains class:disabled class="input">
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
		padding: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 28px;
		font-weight: bold;
		box-sizing: border-box;
		padding-bottom: 0px;
		color: white;
		user-select: none;
	}

	.d {
		animation: bang 0.25s;
		border: 2px solid white;
		transition: all 0.25s;
	}

	.disabled {
		border-color: transparent;
		transition: all 0.25s;
	}

	.correct {
		background: rgb(91, 131, 31);
	}

	.wrong {
		background: red;
	}

	.contains {
		background: rgb(165, 165, 16);
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
