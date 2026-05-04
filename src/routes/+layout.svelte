<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import { partyStore } from '$lib/stores/party.store.svelte';
	import { fightStore } from '$lib/stores/fight.store.svelte';
	import type { Fight } from '$lib/models/fight.models';
	import NavLink from '$lib/components/NavLink.svelte';

	let { children } = $props();

	const generateFightText = (fight: Fight): string => {
		switch (fight.phase) {
			case 'unset':
				return 'No fight ready';
			case 'started':
			case 'paused':
				return `Turn ${fightStore.currentTurn}, ${fightStore.fighters.length} fighter left`;
			case 'ready':
				return 'Fight ready';
		}
	};
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<nav class="navbar bg-base-100 shadow-sm">
	<NavLink route="/fight" text={generateFightText(fightStore)}></NavLink>
	<NavLink route="/party" text="Party of {partyStore.length}"></NavLink>
</nav>
<div class="p-4">
	{@render children()}
</div>
