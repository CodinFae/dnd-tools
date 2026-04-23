<script lang="ts">
	import HeartIcon from '$lib/components/HeartIcon.svelte';
	import InitiativeIcon from '$lib/components/InitiativeIcon.svelte';
	import {
		advanceCharacter,
		fightStore,
		pauseFight,
		resumeFight,
		startFight
	} from '$lib/stores/fight.store.svelte';

	import { goto } from '$app/navigation';
	import { partyStore } from '$lib/stores/party.store.svelte';
	import { setupFight, stopFight } from '$lib/stores/fight.store.svelte';
	import type { Character } from '$lib/models/character.model';

	let fightOnlyCharacters = $state<Character[]>([]);

	const allCharacters = $derived([...partyStore, ...fightOnlyCharacters]);

	const removeCharacter = (name: string) => {
		const filtered = fightOnlyCharacters.filter((a) => a.name !== name);

		fightOnlyCharacters.length = 0;
		fightOnlyCharacters.push(...filtered);
	};

	const addCharacter = (character: Character) => {
		fightOnlyCharacters.push(character);
	};

	const handleSubmit = (event: SubmitEvent & { currentTarget: HTMLFormElement }) => {
		if (!event.currentTarget.checkValidity()) {
			event.preventDefault();
			event.currentTarget.reportValidity();
			return;
		}
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		addCharacter({
			name: formData.get('name')?.toString() ?? 'Unnamed',
			hp: parseInt(formData.get('hp')?.toString() || '1'),
			initiativeModifier: parseInt(formData.get('initiative')?.toString() || '0')
		});
		event.currentTarget.reset();
	};

	const handleStartFight = async () => {
		if (allCharacters.length >= 2) {
			setupFight(allCharacters);
			await goto('/fight');
		}
	};
</script>

{#if fightStore.phase === 'unset'}
	<h1 class="text-4xl">Initiative Tracker</h1>
	<ul class="list">
		{#each fightOnlyCharacters as actor}
			<li class="list-row flex flex-row items-center gap-2">
				<span class="rounded bg-primary p-2 text-primary-content">{actor.name}</span>
				<InitiativeIcon modifier={actor.initiativeModifier}></InitiativeIcon>
				<HeartIcon HP={actor.hp}></HeartIcon>
				<button class="btn" onclick={() => removeCharacter(actor.name)}>Remove</button>
			</li>
		{:else}
			<li class="list-row">No characters added.</li>
		{/each}
		<li class="list-row">
			<form onsubmit={handleSubmit} class="flex flex-row gap-2">
				<input type="text" required class="input border-primary" placeholder="Name" name="name" />
				<input
					type="number"
					required
					class="input border-blue-500"
					placeholder="Initiative"
					name="initiative"
					min="-99"
					max="99"
				/>
				<input
					type="number"
					min="1"
					max="999"
					required
					class="input border-red-500"
					placeholder="HP"
					name="hp"
				/>
				<button class="btn btn-primary" type="submit">Submit</button>
			</form>
		</li>
	</ul>
	<div class="join">
		<button
			class="btn join-item btn-warning"
			onclick={() => fightOnlyCharacters.splice(0, fightOnlyCharacters.length)}>Reset</button
		>
		<button
			class="btn join-item btn-primary"
			disabled={allCharacters.length < 2}
			onclick={handleStartFight}>Start</button
		>
	</div>
{/if}

{#if fightStore.phase === 'ready'}
	<p>There is {fightStore.fighters.length} character(s) in the fight.</p>
	<button class="btn btn-primary" onclick={startFight}>Start</button>
{/if}
{#if fightStore.phase === 'started' || fightStore.phase === 'paused'}
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

	{#if fightStore.phase === 'paused'}
		<button class="btn" onclick={resumeFight}>Resume</button>
	{/if}
	{#if fightStore.phase === 'started'}
		<button class="btn" onclick={pauseFight}>Pause</button>
		<button class="btn" onclick={advanceCharacter}>Next character</button>
		<button class="btn btn-error" onclick={stopFight}>End fight</button>
	{/if}
{/if}
