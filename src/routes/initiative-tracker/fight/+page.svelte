<script>
	import { characterStore } from '../character.store.svelte';

	const turnChar = characterStore
		.map((char) => {
			const rolled = Math.floor(Math.random() * 20) + 1;
			return {
				...char,
				rolled: rolled,
				initiative: char.initiativeModifier + rolled,
				currentHp: char.hp
			};
		})
		.sort((a, b) => b.initiative - a.initiative);

	let currentPlayerIndex = $state(0);
	let turnNumber = $state(1);

	const advanceCharacter = () => {
		const newPlayerIndex = currentPlayerIndex + 1;

		if (newPlayerIndex >= turnChar.length) {
			currentPlayerIndex = 0;
			turnNumber++;
		} else {
			currentPlayerIndex = newPlayerIndex;
		}
		turnTimer = 0;
	};

	let turnTimer = $state(0);
	setInterval(() => {
		turnTimer++;
	}, 1000);
</script>

<p>There is {characterStore.length} character(s) in the fight.</p>
<p>Turn: {turnNumber}</p>
<p>Turn Timer: {turnTimer}s</p>

<ul>
	{#each turnChar as actor, index}
		<li class={`list-row ${currentPlayerIndex == index ? 'bg-accent' : ''}`}>
			{actor.name} - Initiative: {actor.initiative} ({actor.rolled} + {actor.initiativeModifier})
			HP: {actor.currentHp}/{actor.hp}
		</li>
	{:else}
		<li class="list-row">No actors added.</li>
	{/each}
</ul>

<button class="btn" onclick={advanceCharacter}>Next character</button>
