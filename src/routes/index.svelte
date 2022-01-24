<script context="module">
	import { currentWord } from '../routes/api/word';
	import { Base64 } from '../utils/Base64.js';
	import { GameState, GameStore } from '../stores/gamestore.js';

	export const load = async (_) => {
		const setWord = () => {
			const wordData = JSON.parse(Base64.decode(Base64.decode(currentWord)));
			GameStore.set({
				state: GameState.IN_PROGRESS,
				date: Date.now(),
				word: wordData,
				guesses: Array(wordData.guessCount)
					.fill(null)
					.map((_) => ({
						guess: '',
						segments: []
					})),
				guessIndex: 0
			});
		};

		setWord();

		return {};
	};
</script>

<script>
	import CharacterInput from '../components/CharacterInput.svelte';
	import Board from '../components/Board.svelte';
</script>

<svelte:head>
	<title>Kalamchi | کلمچی</title>
	<link
		href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css"
		rel="stylesheet"
		type="text/css"
	/>
</svelte:head>

<input type="hidden">

<main>
	<header>
		<div class="title">
			<h2>کلمچی</h2>
		</div>
	</header>
	<Board on:click={() => {console.log('clicked')}}/>
	<div class="separator"></div>
	<article>
		<p>
			<a href="https://kalamchi.site">کلمچی</a>
			یک <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a> فارسی دیگه!
			<br />
			اینجا نمیدونم چرا کیبورد میزارن. خودش معلومه دیگه. ‌‌ 🤷‍♂️
			<br />
			به قند پارسی تایپ کن تهش Enter بزن.
		</p>
	</article>
	<div class="separator"></div>
	<article>
		<p>قوانینش: <br /> اینم خودتون بلدین ولی به هر حال</p>
		<ul>
			<li>
				<CharacterInput sample state="contains" char="ش" disabled />
				یعنی تو کلمه «ش» هست ولی جاش اشتباهه!
			</li>
			<li>
				<CharacterInput sample state="correct" char="ل" disabled />
				یعنی دقیقا همینجای کلمه «ل» داره!
			</li>
			<li>
				<CharacterInput sample char="ه" disabled />
				<CharacterInput sample char="م" disabled />
				<CharacterInput sample char="د" disabled />
				<CharacterInput sample char="ر" state="correct" disabled />
				<br />
				یعنی نه «ه» داره، نه «میم» داره، نه «دال» داره... یدونه «ر» داره!
			</li>
		</ul>
	</article>
	<div class="separator" />
	<article>
		<div class="links">
			<a href="https://masood.dev" target="_blank">من</a>،
			<span> جا لینک گیتهابی. </span>
		</div>
	</article>
</main>

<style>
	header {
		border-bottom: 0.5px solid #3a3a3c;
		display: flex;
		flex: 1;
		width: 100%;
		margin: 0 0 0px;
		justify-content: space-around;
	}

	header .title {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	header .title h2 {
		font-size: 26px;
		margin: 8px 0;
	}

	main {
		direction: rtl;
		box-sizing: border-box;
		text-align: center;
		width: 100%;
		max-width: 480px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	@media screen and (max-width: 480px) {
		main {
			max-width: 320px;
		}
	}

	main > * {
		box-sizing: border-box;
		width: 100%;
		user-select: none;
	}

	.separator {
		border-bottom: 0.5px solid #3a3a3c;
		display: flex;
		margin: 8px 0;
	}

	article {
		text-align: right;
		padding: 0 8px;
	}

	ul li {
		padding: 4px 0;
	}

	.links {
		display: flex;
		gap: 4px;
	}
</style>
