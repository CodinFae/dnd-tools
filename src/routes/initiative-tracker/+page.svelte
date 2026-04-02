<script lang="ts">
	import type { character } from "./character.model";
    import {characterStore, removeCharacter, addCharacter } from "./character.store.svelte"


    const handleSubmit = (event : SubmitEvent & {currentTarget: HTMLFormElement}) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget);
        addCharacter({
            name: formData.get("name")?.toString() ?? "Unnamed",
            hp: parseInt(formData.get("hp")?.toString() || "0"),
            initiativeModifier: parseInt(formData.get("initiative")?.toString() || "0")
        })
        event.currentTarget.reset()
    }
</script>

<h1 class="text-4xl">Initiative Tracker</h1>
<ul class="list">
    {#each characterStore as actor }
        <li class="list-row">{actor.name} - Initiative: {actor.initiativeModifier} HP: {actor.hp} <button class="btn" onclick={() => removeCharacter(actor.name)}>Remove</button></li>
        {:else}
            <li class="list-row">No actors added.</li>
        {/each}
    <li class="list-row">
        <form onsubmit={handleSubmit} class="flex flex-row">
            <input type="text" class="input" placeholder="Name" name="name">
            <input type="number" class="input" placeholder="Initiative modifier" name="initiative">
            <input type="number" class="input" placeholder="HP" name="hp">
            <button class="btn" type="submit">Submit</button>
        </form>
    </li>
</ul>
<div class="join">
  <button class="btn join-item" onclick={() => characterStore.splice(0, characterStore.length)}>Reset</button>
  <a class="btn join-item btn-accent" href="/initiative-tracker/fight">Start</a>
</div>