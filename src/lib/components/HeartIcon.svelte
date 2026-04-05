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

<p class="bg-red-500 text-white font-bold p-2 rounded flex items-center justify-center"> {displayValue} </p>