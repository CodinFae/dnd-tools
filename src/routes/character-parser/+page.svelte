<script lang="ts">
	import { parseXMLCharacter, validateCharacter } from '$lib/parsers/xmlCharacterParser';
	import CharacterDisplay from './character-display.svelte';
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

<div class=" mx-auto">
	<h1 class="mb-6 text-4xl font-bold">Character Parser</h1>

	<div class="card max-w-2xl bg-base-200 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Import Characters</h2>
			<p class="mb-4 text-sm opacity-75">Upload XML files containing D&D 5e characters</p>

			<div class="form-control">
				<label class="label" for="xml-file-input">
					<span class="label-text">Select XML Files</span>
				</label>
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

			{#if error}
				<div class="mt-4 alert alert-error">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 shrink-0 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m2 2l-2-2m0 0l2-2m-2 2l2 2"
						/>
					</svg>
					<div>
						<div class="font-bold">Error</div>
						<div class="text-sm whitespace-pre-wrap">{error}</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	{#if characters.length > 0}
		<div class="mt-4 rounded bg-base-100 p-3">
			<p class="font-semibold">{characters.length} character(s) loaded</p>
			<ul class="mt-2 flex list-inside flex-col gap-2">
				{#each characters as char, idx}
					<li>
						<CharacterDisplay character={char}></CharacterDisplay>
					</li>
				{/each}
				<button class="btn" onclick={saveToStore}>Save</button>
			</ul>
		</div>
	{/if}
</div>
