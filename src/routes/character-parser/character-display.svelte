<script lang="ts">
	import type { ParsedCharacter } from '../../models/character';

	interface Props {
		character: ParsedCharacter;
	}

	let { character }: Props = $props();

	/**
	 * Calculate D&D ability modifier from an ability score
	 * Standard formula: (score - 10) / 2, rounded down
	 */
	function calculateModifier(score: number | undefined): number {
		if (score === undefined) return 0;
		return Math.floor((score - 10) / 2);
	}

	/**
	 * Format a modifier with + prefix for positive values
	 */
	function formatModifier(mod: number): string {
		if (mod > 0) return `+${mod}`;
		if (mod < 0) return `${mod}`;
		return '0';
	}

	/**
	 * Extract movement squares from speed string (e.g., "30 ft." => 6 squares)
	 * Assumes 5 feet per square (standard D&D 5e grid)
	 */
	function parseMovementSquares(speedStr: string | undefined): number | null {
		if (!speedStr) return null;
		const match = speedStr.match(/(\d+)/);
		if (!match) return null;
		const feet = parseInt(match[1], 10);
		return Math.floor(feet / 5);
	}

	const strMod = $derived(calculateModifier(character.stats.str));
	const dexMod = $derived(calculateModifier(character.stats.dex));
	const conMod = $derived(calculateModifier(character.stats.con));
	const intMod = $derived(calculateModifier(character.stats.int));
	const wisMod = $derived(calculateModifier(character.stats.wis));
	const chaMod = $derived(calculateModifier(character.stats.cha));
	const movementSquares = $derived(parseMovementSquares(character.speed));
</script>

<!-- Character display using DaisyUI -->
 <div class="card bg-base-200">
<div class="card-body flex flex-col gap-2 p-2">
	<!-- Row 1: Name + Class + Init + AC + HP + Movement -->
	<div class="flex flex-wrap items-center gap-2">
		<div class="badge badge-lg badge-primary">
			{character.label}
		</div>

		<div class="badge badge-lg">
			{character.class}
		</div>

		{#if character.init !== undefined}
			<div class="badge badge-sm badge-success" title="Initiative">
				Init {formatModifier(character.init)}
			</div>
		{/if}

		{#if character.ac}
			<div class="badge badge-sm" title="Armor Class">AC {character.ac}</div>
		{/if}

		{#if character.hp}
			<div class="badge badge-sm" title="Hit Points">HP {character.hp}</div>
		{/if}

		{#if movementSquares !== null}
			<div class="badge badge-sm badge-warning" title="Movement Squares (5 ft. per square)">
				Mov {movementSquares}sq
			</div>
		{/if}
	</div>

	<!-- Row 2: Ability Score Modifiers with Raw Values -->
	<div class="flex flex-wrap items-center gap-2">
		{#if character.stats.str !== undefined}
			<div class="badge badge-sm badge-outline" title="Strength">
				STR {character.stats.str} {formatModifier(strMod)}
			</div>
		{/if}

		{#if character.stats.dex !== undefined}
			<div class="badge badge-sm badge-outline" title="Dexterity">
				DEX {character.stats.dex} {formatModifier(dexMod)}
			</div>
		{/if}

		{#if character.stats.con !== undefined}
			<div class="badge badge-sm badge-outline" title="Constitution">
				CON {character.stats.con} {formatModifier(conMod)}
			</div>
		{/if}

		{#if character.stats.int !== undefined}
			<div class="badge badge-sm badge-outline" title="Intelligence">
				INT {character.stats.int} {formatModifier(intMod)}
			</div>
		{/if}

		{#if character.stats.wis !== undefined}
			<div class="badge badge-sm badge-outline" title="Wisdom">
				WIS {character.stats.wis} {formatModifier(wisMod)}
			</div>
		{/if}

		{#if character.stats.cha !== undefined}
			<div class="badge badge-sm badge-outline" title="Charisma">
				CHA {character.stats.cha} {formatModifier(chaMod)}
			</div>
		{/if}

		{#if character.passive !== undefined}
			<div class="badge badge-sm badge-info" title="Passive Perception">
				PP {character.passive}
			</div>
		{/if}
	</div>

	<!-- Row 3: Skills + Saves -->
	<div class="flex flex-wrap items-center gap-2">
		{#if character.skills && character.skills.length > 0}
			<div class="tooltip" data-tip="Skills">
				<span class="text-xs font-semibold">Skills:</span>
			</div>
			{#each character.skills as skill}
				<div class="badge badge-sm badge-accent">{skill}</div>
			{/each}
		{/if}

		{#if character.saves && character.saves.length > 0}
			<div class="divider divider-horizontal my-0 mx-1"></div>
			<div class="tooltip" data-tip="Saving Throws">
				<span class="text-xs font-semibold">Saves:</span>
			</div>
			{#each character.saves as save}
				<div class="badge badge-sm badge-secondary">{save}</div>
			{/each}
		{/if}
	</div>
</div>
</div>