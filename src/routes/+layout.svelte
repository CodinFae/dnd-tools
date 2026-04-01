<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<nav>
	<a href="/">home</a>
	<a href="/initiative-tracker">initiative tracker</a>
</nav>
{@render children()}
