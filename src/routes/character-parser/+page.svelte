<script lang="ts">
	import { parseXMLCharacter, validateCharacter } from '$lib/parsers/xmlCharacterParser';
	import type { ParsedCharacter } from '../../models/character';

	let characters: ParsedCharacter[] = $state([]);
	let error: string | null = $state(null);
	let loading = $state(false);
	let selectedCharacterIndex = $state<number | null>(null);

	async function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		loading = true;
		error = null;

		try {
			const xmlString = await file.text();
			const parsed = parseXMLCharacter(xmlString);

			// Validate each character
			const validationErrors = parsed.flatMap((char, idx) => {
				const errors = validateCharacter(char);
				return errors.map((e) => `Character ${idx + 1}: ${e}`);
			});

			if (validationErrors.length > 0) {
				error = validationErrors.join('\n');
				return;
			}

			characters = parsed;
			selectedCharacterIndex = characters.length > 0 ? 0 : null;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to parse XML file';
		} finally {
			loading = false;
			// Reset file input
			target.value = '';
		}
	}

	function handleClearAll() {
		characters = [];
		selectedCharacterIndex = null;
	}
</script>

<div class="max-w-6xl mx-auto">
	<h1 class="text-4xl font-bold mb-6">Character Parser</h1>

	<!-- File Upload Section -->
	<div class="card bg-base-200 shadow-xl mb-6">
		<div class="card-body">
			<h2 class="card-title">Import Characters</h2>
			<p class="text-sm opacity-75 mb-4">
				Upload an XML file containing D&D 5e characters
			</p>

			<div class="form-control">
				<label class="label">
					<span class="label-text">Select XML File</span>
				</label>
				<input
					type="file"
					accept=".xml"
					onchange={handleFileUpload}
					disabled={loading}
					class="file-input file-input-bordered w-full"
				/>
			</div>

			{#if loading}
				<div class="mt-4">
					<span class="loading loading-spinner"></span>
					<span class="ml-2">Parsing file...</span>
				</div>
			{/if}

			{#if error}
				<div class="alert alert-error mt-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current shrink-0 h-6 w-6"
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

	<!-- Characters List -->
	{#if characters.length > 0}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Characters List Sidebar -->
			<div class="lg:col-span-1">
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">Characters ({characters.length})</h2>

						<div class="space-y-2">
							{#each characters as char, idx}
								<button
									class="btn btn-block justify-start text-left"
									class:btn-active={selectedCharacterIndex === idx}
									onclick={() => (selectedCharacterIndex = idx)}
								>
									<div class="flex flex-col items-start w-full">
										<div class="font-bold">{char.label}</div>
										<div class="text-xs opacity-75">{char.name}</div>
									</div>
								</button>
							{/each}
						</div>

						<button
							class="btn btn-outline btn-error mt-4 w-full"
							onclick={handleClearAll}
						>
							Clear All
						</button>
					</div>
				</div>
			</div>

			<!-- Character Details -->
			<div class="lg:col-span-2">
				{#if selectedCharacterIndex !== null}
					{@const character = characters[selectedCharacterIndex]}
					<div class="card bg-base-100 shadow-xl">
						<div class="card-body">
							<h2 class="card-title">{character.label}</h2>

							<!-- Basic Info -->
							<div class="grid grid-cols-2 gap-4 mb-4">
								<div>
									<p class="text-sm opacity-75">Name</p>
									<p class="font-semibold">{character.name}</p>
								</div>
								{#if character.level}
									<div>
										<p class="text-sm opacity-75">Level</p>
										<p class="font-semibold">{character.level}</p>
									</div>
								{/if}
								{#if character.size}
									<div>
										<p class="text-sm opacity-75">Size</p>
										<p class="font-semibold">{character.size}</p>
									</div>
								{/if}
								{#if character.ac}
									<div>
										<p class="text-sm opacity-75">Armor Class</p>
										<p class="font-semibold">{character.ac}</p>
									</div>
								{/if}
								{#if character.hp}
									<div>
										<p class="text-sm opacity-75">Hit Points</p>
										<p class="font-semibold">{character.hp}</p>
									</div>
								{/if}
								{#if character.speed}
									<div>
										<p class="text-sm opacity-75">Speed</p>
										<p class="font-semibold">{character.speed}</p>
									</div>
								{/if}
								{#if character.init !== undefined}
									<div>
										<p class="text-sm opacity-75">Initiative</p>
										<p class="font-semibold">+{character.init}</p>
									</div>
								{/if}
								{#if character.passive !== undefined}
									<div>
										<p class="text-sm opacity-75">Passive Perception</p>
										<p class="font-semibold">{character.passive}</p>
									</div>
								{/if}
							</div>

							<!-- Ability Scores -->
							<div class="divider my-2"></div>
							<h3 class="font-bold mb-3">Ability Scores</h3>
							<div class="grid grid-cols-3 gap-2 mb-4">
								{#if character.stats.str !== undefined}
									<div class="stat bg-base-200 rounded">
										<div class="stat-title text-xs">STR</div>
										<div class="stat-value text-xl">{character.stats.str}</div>
									</div>
								{/if}
								{#if character.stats.dex !== undefined}
									<div class="stat bg-base-200 rounded">
										<div class="stat-title text-xs">DEX</div>
										<div class="stat-value text-xl">{character.stats.dex}</div>
									</div>
								{/if}
								{#if character.stats.con !== undefined}
									<div class="stat bg-base-200 rounded">
										<div class="stat-title text-xs">CON</div>
										<div class="stat-value text-xl">{character.stats.con}</div>
									</div>
								{/if}
								{#if character.stats.int !== undefined}
									<div class="stat bg-base-200 rounded">
										<div class="stat-title text-xs">INT</div>
										<div class="stat-value text-xl">{character.stats.int}</div>
									</div>
								{/if}
								{#if character.stats.wis !== undefined}
									<div class="stat bg-base-200 rounded">
										<div class="stat-title text-xs">WIS</div>
										<div class="stat-value text-xl">{character.stats.wis}</div>
									</div>
								{/if}
								{#if character.stats.cha !== undefined}
									<div class="stat bg-base-200 rounded">
										<div class="stat-title text-xs">CHA</div>
										<div class="stat-value text-xl">{character.stats.cha}</div>
									</div>
								{/if}
							</div>

							<!-- Saves -->
							{#if character.saves.length > 0}
								<div class="divider my-2"></div>
								<h3 class="font-bold mb-3">Saving Throws</h3>
								<div class="space-y-1 mb-4">
									{#each character.saves as save}
										<div class="text-sm">{save}</div>
									{/each}
								</div>
							{/if}

							<!-- Skills -->
							{#if character.skills.length > 0}
								<div class="divider my-2"></div>
								<h3 class="font-bold mb-3">Skills</h3>
								<div class="space-y-1 mb-4">
									{#each character.skills as skill}
										<div class="text-sm">{skill}</div>
									{/each}
								</div>
							{/if}

							<!-- Actions -->
							{#if character.actions.length > 0}
								<div class="divider my-2"></div>
								<h3 class="font-bold mb-3">Actions</h3>
								<div class="space-y-3">
									{#each character.actions as action}
										<div class="bg-base-200 p-3 rounded">
											<p class="font-semibold">{action.name}</p>
											<p class="text-sm mt-1">{action.text}</p>
											{#if action.attack}
												<p class="text-xs opacity-75 mt-1">
													Attack: {action.attack}
												</p>
											{/if}
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{:else if !loading}
		<div class="alert alert-info mb-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="stroke-current shrink-0 w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<span>Upload an XML file to get started</span>
		</div>
	{/if}
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
