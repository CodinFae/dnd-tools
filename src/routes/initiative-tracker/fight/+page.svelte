<script>
	import HeartIcon from '$lib/components/HeartIcon.svelte';
	import InitiativeIcon from '$lib/components/InitiativeIcon.svelte';
	import { fightStore } from '$lib/stores/fight.store.svelte';
	

	let currentPlayerIndex = $state(0);
	let turnNumber = $state(1);

	const advanceCharacter = () => {
		const newPlayerIndex = currentPlayerIndex + 1;

		if (newPlayerIndex >= fightStore.fighters.length) {
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

<p>There is {fightStore.fighters.length} character(s) in the fight.</p>
<p>Turn: {turnNumber}</p>
<p>Turn Timer: {turnTimer}s</p>

<ul>
	{#each fightStore.fighters as actor, index}
		<li class={`list-row flex flex-row gap-2 p-2 rounded items-center ${currentPlayerIndex == index ? 'bg-yellow-500 border-2 border-yellow-300' : ''}`}>
			<span class="p-2 rounded bg-primary text-primary-content">{actor.name}</span>
			<InitiativeIcon modifier={actor.initiativeModifier} rolled={actor.rolled}></InitiativeIcon>
			<div class="indicator">
				<div class="indicator-item indicator-top indicator-end">
					<button class="btn btn-circle btn-xs">+</button>
				</div>
				<HeartIcon currentHP={actor.currentHp} HP={actor.hp}></HeartIcon>

			</div>
		</li>
	{:else}
		<li class="list-row">No actors added.</li>
	{/each}
</ul>

<button class="btn" onclick={advanceCharacter}>Next character</button>
