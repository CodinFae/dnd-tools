<script lang="ts">
	import { goto } from '$app/navigation';
	import HeartIcon from '$lib/components/HeartIcon.svelte';
	import InitiativeIcon from '$lib/components/InitiativeIcon.svelte';
	import type { Character } from '$lib/models/character.model';
	import {
		partyStore,
	} from '$lib/stores/party.store.svelte';
	import { setupFight } from '$lib/stores/fight.store.svelte';

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
