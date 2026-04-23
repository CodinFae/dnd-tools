<script lang="ts">
	import { partyStore, removeCharacter } from '$lib/stores/party.store.svelte';
	import { feetToSquare } from '$lib/utils/dnd.utils';
	import { formatModifier, formatAttributeModifier } from '$lib/utils/format.utils';

	const sortedParty = $derived(partyStore.toSorted((a, b) => a.name.localeCompare(b.name)));

	let selectedNames = $state(new Set<string>());
	const selected = $derived(sortedParty.filter((p) => selectedNames.has(p.name)));

	const toggleSelectedList = (name: string) => {
		return () => {
			if (selectedNames.has(name)) {
				selectedNames.delete(name);
			} else {
				selectedNames.add(name);
			}
			selectedNames = new Set(selectedNames);
		};
	};

	let indeterminateAll = $derived(
		selectedNames.size > 0 && selectedNames.size < sortedParty.length
	);
	let checkedAll = $derived(selectedNames.size > 0 && selectedNames.size >= sortedParty.length);

	const removeSelected = () => {
		selectedNames.forEach((name) => {
			removeCharacter(name);
			selectedNames.delete(name);
		});
	};

	import { parseXMLCharacter, validateCharacter } from '$lib/parsers/xmlCharacterParser';
	import { addCharacter } from '$lib/stores/party.store.svelte';
	import type { PartyMember } from '$lib/models/character.model';

	let characters: PartyMember[] = $state([]);
	let error: string | null = $state(null);
	let loading = $state(false);

	async function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;

		if (!files || files.length === 0) return;

		loading = true;
		error = null;
		characters = [];

		try {
			const allCharacters: PartyMember[] = [];

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const xmlString = await file.text();
				const parsed = parseXMLCharacter(xmlString);

				// Validate each character
				const validationErrors = parsed.flatMap((char, idx) => {
					const errors = validateCharacter(char);
					return errors.map((e) => `${file.name} - Character ${idx + 1}: ${e}`);
				});

				if (validationErrors.length > 0) {
					error = (error ? error + '\n' : '') + validationErrors.join('\n');
				}

				allCharacters.push(...parsed);
			}

			characters = allCharacters;
			saveToStore();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to parse XML files';
		} finally {
			loading = false;
			target.value = '';
		}
	}

	const saveToStore = () => {
		characters.forEach((char) => {
			addCharacter(char);
		});
	};
</script>

<div class="overflow-auto">
	<div class="mb-2">
		<h2 class="card-title">Import Characters</h2>
		<p class="mb-4 text-sm opacity-75">Upload XML files containing D&D 5e characters</p>

		<div class="form-control">
			<input
				id="xml-file-input"
				type="file"
				accept=".xml"
				multiple
				onchange={handleFileUpload}
				disabled={loading}
				class="file-input-bordered file-input w-full"
			/>
		</div>

		{#if loading}
			<div class="mt-4 flex items-center gap-2">
				<span class="loading loading-spinner"></span>
				<span>Parsing files...</span>
			</div>
		{/if}
	</div>
	<div class="flex flex-row justify-items-center align-middle">
		<p>{selected.length} selected</p>
		<button class="btn btn-ghost btn-error" disabled={selected.length < 1} onclick={removeSelected}
			>Delete</button
		>
	</div>
	<table class="table">
		<thead>
			<tr>
				<th>
					<input
						type="checkbox"
						class="checkbox"
						indeterminate={indeterminateAll}
						checked={checkedAll}
					/>
				</th>
				<th> Name </th>
				<th> Heritage and Class </th>
				<th> Initiative </th>
				<th> HP </th>
				<th> AC </th>
				<th> Speed </th>
				<th> Attributes </th>
			</tr>
		</thead>
		<tbody>
			{#each sortedParty as partyMember}
				<tr>
					<td>
						<input
							type="checkbox"
							class="checkbox"
							checked={selectedNames.has(partyMember.name)}
							onclick={toggleSelectedList(partyMember.name)}
						/>
					</td>
					<td>
						{partyMember.name}
					</td>
					<td>
						{partyMember.class}
					</td>
					<td>
						{formatModifier(partyMember.initiativeModifier)}
					</td>
					<td>
						{partyMember.hp}
					</td>
					<td>
						{partyMember.ac}
					</td>
					<td>
						{feetToSquare(partyMember.speedFt)} sq
					</td>
					<td class="flex flex-row gap-2">
						<span>STR{formatAttributeModifier(partyMember.stats.str)}</span>
						<span>DEX{formatAttributeModifier(partyMember.stats.dex)}</span>
						<span>CON{formatAttributeModifier(partyMember.stats.con)}</span>
						<span>INT{formatAttributeModifier(partyMember.stats.int)}</span>
						<span>WIS{formatAttributeModifier(partyMember.stats.wis)}</span>
						<span>CHA{formatAttributeModifier(partyMember.stats.cha)}</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
