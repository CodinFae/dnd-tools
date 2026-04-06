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

	const strMod = calculateModifier(character.stats.str);
	const dexMod = calculateModifier(character.stats.dex);
	const conMod = calculateModifier(character.stats.con);
	const intMod = calculateModifier(character.stats.int);
	const wisMod = calculateModifier(character.stats.wis);
	const chaMod = calculateModifier(character.stats.cha);
</script>

<!-- Single-line character display using DaisyUI -->
<div class="flex flex-wrap items-center gap-2 p-2 bg-base-100">
	<!-- Character Name and Class -->
	<div class="badge badge-lg badge-primary">
		{character.label}
	</div>

	<div class="badge badge-lg">
		{character.class}
		{#if character.level}
			{character.level}
		{/if}
	</div>

	<!-- AC and HP -->
	{#if character.ac}
		<div class="badge badge-sm" title="Armor Class">AC {character.ac}</div>
	{/if}

	{#if character.hp}
		<div class="badge badge-sm" title="Hit Points">HP {character.hp}</div>
	{/if}

	<!-- Initiative -->
	{#if character.init !== undefined}
		<div class="badge badge-sm badge-success" title="Initiative">
			Init {formatModifier(character.init)}
		</div>
	{/if}

	<!-- Ability Score Modifiers -->
	<div class="divider divider-horizontal my-0 mx-1"></div>

	{#if character.stats.str !== undefined}
		<div class="badge badge-sm badge-outline" title="Strength">
			STR {formatModifier(strMod)}
		</div>
	{/if}

	{#if character.stats.dex !== undefined}
		<div class="badge badge-sm badge-outline" title="Dexterity">
			DEX {formatModifier(dexMod)}
		</div>
	{/if}

	{#if character.stats.con !== undefined}
		<div class="badge badge-sm badge-outline" title="Constitution">
			CON {formatModifier(conMod)}
		</div>
	{/if}

	{#if character.stats.int !== undefined}
		<div class="badge badge-sm badge-outline" title="Intelligence">
			INT {formatModifier(intMod)}
		</div>
	{/if}

	{#if character.stats.wis !== undefined}
		<div class="badge badge-sm badge-outline" title="Wisdom">
			WIS {formatModifier(wisMod)}
		</div>
	{/if}

	{#if character.stats.cha !== undefined}
		<div class="badge badge-sm badge-outline" title="Charisma">
			CHA {formatModifier(chaMod)}
		</div>
	{/if}

	<!-- Passive Perception -->
	{#if character.passive !== undefined}
		<div class="divider divider-horizontal my-0 mx-1"></div>
		<div class="badge badge-sm badge-info" title="Passive Perception">
			PP {character.passive}
		</div>
	{/if}
</div>
