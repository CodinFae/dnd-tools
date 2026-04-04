<script lang="ts">
	let { value} = $props<{
		value: number;
	}>();

</script>

<p class="bg-red-500 text-white font-bold p-2 rounded w-10 flex items-center justify-center"> {value} </p>