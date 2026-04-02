<script lang="ts">
	import type { character } from "../../models/characters";

    let characters = $state<character[]>([])

    const removeCharacter = (name : string) => characters = characters.filter(a => a.name != name)
    const addCharacter = (event : SubmitEvent & {currentTarget: HTMLFormElement}) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget);
        console.log(formData)
        characters.push({
            name: formData.get("name"),
            hp: formData.get("hp"),
            initiativeModifier: formData.get("initiative")
        } satisfies character)
    }
</script>

<h1 class="text-4xl">Initiative Tracker</h1>
<ul class="list">
    {#each characters as actor }
        <li class="list-row">{actor.name} - Initiative: {actor.initiativeModifier} HP: {actor.hp}</li>
        {:else}
            <li class="list-row">No actors added.</li>
        {/each}
    <li class="list-row">
        <form onsubmit={addCharacter} class="flex flex-row">
            <input type="text" class="input" placeholder="Name" name="name">
            <input type="number" class="input" placeholder="Initiative modifier" name="initiative">
            <input type="number" class="input" placeholder="HP" name="hp">
            <button class="btn" type="submit">Submit</button>
        </form>
    </li>
</ul>
<div class="join">
  <button class="btn join-item">Add</button>
  <button class="btn join-item btn-accent">Start</button>
</div>