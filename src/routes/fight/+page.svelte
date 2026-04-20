<script>
	import HeartIcon from '$lib/components/HeartIcon.svelte';
	import InitiativeIcon from '$lib/components/InitiativeIcon.svelte';
	import { advanceCharacter, fightStore, startFight } from '$lib/stores/fight.store.svelte';
</script>

{#if fightStore.phase === 'ready'}
	<p>There is {fightStore.fighters.length} character(s) in the fight.</p>
	<button class="btn btn-primary" onclick={startFight}>Start</button>
{/if}
{#if fightStore.phase === 'started'}
	<p>Turn: {fightStore.currentTurn}</p>
	<p>Turn Timer: {fightStore.turnSeconds}s</p>

	<ul>
		{#each fightStore.fighters as actor, index}
			<li
				class={`list-row flex flex-row items-center gap-2 rounded p-2 ${fightStore.currentCharacterIndex == index ? 'border-2 border-yellow-300 bg-yellow-500' : ''}`}
			>
				<span class="rounded bg-primary p-2 text-primary-content">{actor.name}</span>
				<InitiativeIcon modifier={actor.initiativeModifier} rolled={actor.rolled}></InitiativeIcon>
				<div class="indicator">
					<div class="indicator-item indicator-end indicator-top">
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
{/if}
