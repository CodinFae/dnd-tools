<script lang="ts">
	let { HP, currentHP } = $props<{
		HP?: number;
		currentHP?: number;
	}>();

	const displayValue = $derived.by(() => {
		if (currentHP !== undefined && HP !== undefined) {
			return `${currentHP}/${HP}`;
		}
		return HP ?? 0;
	});
</script>

<p class="flex items-center justify-center rounded bg-red-500 p-2 font-bold text-white">
	{displayValue}
</p>
