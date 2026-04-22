<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import { page } from '$app/state';
	import { partyStore } from '$lib/stores/party.store.svelte';
	import { fightStore } from '$lib/stores/fight.store.svelte';
	import type { Fight } from '$lib/models/fight.models';

	let { children } = $props();

	const isActive = (path: string) => {
		return page.url.pathname === path || page.url.pathname.startsWith(path + '/');
	};

	const generateFightText  = (fight: Fight) : string => {
		switch(fight.phase){
			case 'unset':
				return "No fight ready";
			case 'started':
			case 'paused':
				return `Turn ${fightStore.currentTurn}, ${fightStore.fighters.length} fighter left`
			case 'ready':
				return "Fight ready"
		}
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<nav class="navbar bg-base-100 shadow-sm">
	<a class="btn text-xl btn-ghost" href="/" class:btn-active={isActive('/')}>Home</a>
	<a
		class="btn text-xl btn-ghost"
		href="/fight-config"
		class:btn-active={isActive('/fight-config')}>Fight config</a
	>

		<a class="btn text-xl btn-ghost" href="/fight" class:btn-active={isActive("/fight")}
			>{generateFightText(fightStore)}</a
		>
	<a
		class="btn text-xl btn-ghost"
		href="/character-parser"
		class:btn-active={isActive('/character-parser')}>Character parser</a
	>
	<a class="btn text-xl btn-ghost"
		href="/party"
		class:btn-active={isActive('/party')}>Party of {partyStore.length}</a>

	
</nav>
<div class="p-4">
	{@render children()}
</div>
