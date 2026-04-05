<script lang="ts">
	let { rolled, modifier } = $props<{
		rolled?: number;
		modifier?: number;
	}>();

	const displayValue = $derived.by(() => {
		if (rolled !== undefined && modifier !== undefined) {
			const result = rolled + modifier;
			return `${result} (${rolled} ${modifier >= 0 ? '+' : '-'} ${Math.abs(modifier)})`;
		}
		const val = modifier ?? 0;
		return val > 0 ? `+${val}` : `${val}`;
	});

</script>

<p class="bg-blue-500  text-white font-bold p-2 rounded mw-10 flex items-center justify-center"> {displayValue} </p>