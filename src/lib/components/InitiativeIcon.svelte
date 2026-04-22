<script lang="ts">
	import { formatModifier } from "$lib/utils/format.utils";

	let { rolled, modifier } = $props<{
		rolled?: number;
		modifier?: number;
	}>();

	const displayValue = $derived.by(() => {
		if (rolled !== undefined && modifier !== undefined) {
			const result = rolled + modifier;
			return `${result} (${rolled} ${formatModifier(modifier)} ${Math.abs(modifier)})`;
		}
		const val = modifier ?? 0;
		return val > 0 ? `+${val}` : `${val}`;
	});
</script>

<p class="mw-10 flex items-center justify-center rounded bg-blue-500 p-2 font-bold text-white">
	{displayValue}
</p>
