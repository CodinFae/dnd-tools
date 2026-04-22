<script>
	import CharacterDisplay from "$lib/components/CharacterDisplay.svelte";
    import {partyStore} from "$lib/stores/party.store.svelte"
</script>

{#each partyStore as partyMember}
    <CharacterDisplay character={partyMember}></CharacterDisplay>
    
{/each}