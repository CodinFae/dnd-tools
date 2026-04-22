<script lang="ts">
	import { calculateAttributeModifier, feetToSquare } from '$lib/utils/dnd.utils';
	import { formatModifier } from '$lib/utils/format.utils';
	import type { PartyMember } from '../models/character.model';

	interface Props {
		character: PartyMember;
	}

	let { character }: Props = $props();



	const strMod = $derived(calculateAttributeModifier(character.stats.str));
	const dexMod = $derived(calculateAttributeModifier(character.stats.dex));
	const conMod = $derived(calculateAttributeModifier(character.stats.con));
	const intMod = $derived(calculateAttributeModifier(character.stats.int));
	const wisMod = $derived(calculateAttributeModifier(character.stats.wis));
	const chaMod = $derived(calculateAttributeModifier(character.stats.cha));
	const movementSquares = $derived(feetToSquare(character.speed));
</script>

<!-- Character display using DaisyUI -->
<div class="card bg-base-200">
	<div class="card-body flex flex-col gap-2 p-2">
		<!-- Row 1: Name + Class + Init + AC + HP + Movement -->
		<div class="flex flex-wrap items-center gap-2">
			<div class="badge badge-lg badge-primary">
				{character.name}
			</div>

			<div class="badge badge-lg">
				{character.class}
			</div>

			{#if character.initiativeModifier !== undefined}
				<div class="badge badge-sm badge-success" title="Initiative">
					Init {formatModifier(character.initiativeModifier)}
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
				<div class="badge badge-outline badge-sm" title="Strength">
					STR {character.stats.str}
					{formatModifier(strMod)}
				</div>
			{/if}

			{#if character.stats.dex !== undefined}
				<div class="badge badge-outline badge-sm" title="Dexterity">
					DEX {character.stats.dex}
					{formatModifier(dexMod)}
				</div>
			{/if}

			{#if character.stats.con !== undefined}
				<div class="badge badge-outline badge-sm" title="Constitution">
					CON {character.stats.con}
					{formatModifier(conMod)}
				</div>
			{/if}

			{#if character.stats.int !== undefined}
				<div class="badge badge-outline badge-sm" title="Intelligence">
					INT {character.stats.int}
					{formatModifier(intMod)}
				</div>
			{/if}

			{#if character.stats.wis !== undefined}
				<div class="badge badge-outline badge-sm" title="Wisdom">
					WIS {character.stats.wis}
					{formatModifier(wisMod)}
				</div>
			{/if}

			{#if character.stats.cha !== undefined}
				<div class="badge badge-outline badge-sm" title="Charisma">
					CHA {character.stats.cha}
					{formatModifier(chaMod)}
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
				<div class="divider mx-1 my-0 divider-horizontal"></div>
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
