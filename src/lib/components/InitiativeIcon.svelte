<script lang="ts">
	let { value, size = 24 } = $props<{
		value: number;
		size?: number;
	}>();

	const displayValue = $derived(value > 0 ? `+${value}` : `${value}`);

</script>

<p class="bg-blue-500  text-white font-bold p-2 rounded w-10 flex items-center justify-center"> {displayValue} </p>