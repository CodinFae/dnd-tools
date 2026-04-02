<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<nav class="navbar bg-base-100 shadow-sm">
	<a class="btn text-xl btn-ghost" href="/">Home</a>
	<a class="btn text-xl btn-ghost" href="/initiative-tracker">Initiative tracker</a>
</nav>
{@render children()}
