<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import { page } from '$app/state';	
	import { characterStore } from '$lib/stores/character.store.svelte';
	import { fightStore } from '$lib/stores/fight.store.svelte';
	
	let { children } = $props();
	
		const isActive = (path: string) => {
		return page.url.pathname === path || page.url.pathname.startsWith(path + '/');
	};
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<nav class="navbar bg-base-100 shadow-sm">
	<a class="btn text-xl btn-ghost" href="/" class:btn-active={isActive('/')}>Home</a>
	<a class="btn text-xl btn-ghost" href="/initiative-tracker" class:btn-active={isActive('/initiative-tracker')}>Initiative tracker</a>
	<a class="btn text-xl btn-ghost" href="/character-parser" class:btn-active={isActive('/character-parser')}>Character parser</a>
	<span>Party {characterStore.length}</span>
	{#if fightStore }
		<a class="btn text-xl btn-ghost" href="/initiative-tracker/fight">Turn {fightStore.currentTurn}, {fightStore.fighters.length} fighter left</a>
	{/if}
</nav>
<div class="p-4">
{@render children()}

</div>
