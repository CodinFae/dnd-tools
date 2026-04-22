<script lang="ts">
	import { page } from '$app/state';

    interface Props {
        route: string,
        text: string
    }
    let {route, text} : Props = $props();

	const isActive = (path: string) => {
		return page.url.pathname === path || page.url.pathname.startsWith(path + '/');
	};
</script>

	<a
		class="btn text-xl btn-ghost"
		href="{route}"
		class:btn-active={isActive(route)}>{text}</a
	>