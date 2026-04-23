<script lang=ts>
    import {partyStore, removeCharacter} from "$lib/stores/party.store.svelte"
	import { feetToSquare } from "$lib/utils/dnd.utils";
	import { formatModifier, formatAttributeModifier } from "$lib/utils/format.utils";

    const sortedParty = $derived(partyStore.toSorted((a,b) => a.name.localeCompare(b.name)))
    
    let selectedNames = $state(new Set<string>());
    const selected = $derived(
    sortedParty.filter(p => selectedNames.has(p.name))
);


	const toggleSelectedList = (name : string ) => {
        return () => {
            if (selectedNames.has(name)) {
                selectedNames.delete(name);
            } else {
                selectedNames.add(name);
            }
            selectedNames = new Set(selectedNames);
        }
    }


    let indeterminateAll = $derived(selectedNames.size > 0 && selectedNames.size < sortedParty.length)
    let checkedAll = $derived(selectedNames.size >= sortedParty.length)

    const removeSelected = () => {
        selectedNames.forEach(name => {
            removeCharacter(name)
            selectedNames.delete(name)
        });
    }
	
</script>

<div class="overflow-auto">
    <div class="flex flex-row align-middle justify-items-center">
        <p>{selected.length} selected</p>
        <button class="btn btn-ghost btn-error" disabled={selected.length <1} onclick={removeSelected}>Delete</button>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>
                    <input type="checkbox" class="checkbox" indeterminate="{indeterminateAll}" checked={checkedAll}/>
                </th>
                <th>
                    Name
                </th>
                <th>
                    Heritage and Class
                </th>
                <th>
                    Initiative
                </th>
                <th>
                    HP
                </th>
                <th>
                    AC
                </th>
                <th>
                    Speed
                </th>
                <th>
                    Attributes
                </th>
            </tr>
        </thead>
        <tbody>

        {#each sortedParty as partyMember}
        <tr>
            <td>
                <input type="checkbox" class="checkbox" 
                checked={selectedNames.has(partyMember.name)}
                onclick={toggleSelectedList(partyMember.name)}>
            </td>
            <td>
                {partyMember.name}
            </td>
            <td>
                {partyMember.class}
            </td>
            <td>
                {formatModifier(partyMember.initiativeModifier)}
            </td>
            <td>
                {partyMember.hp}
            </td>
            <td>
                {partyMember.ac}
            </td>
            <td>
                {feetToSquare(partyMember.speedFt)} sq
            </td>
            <td class="flex flex-row gap-2">
                <span>STR{formatAttributeModifier(partyMember.stats.str)}</span>
                <span>DEX{formatAttributeModifier(partyMember.stats.dex)}</span>
                <span>CON{formatAttributeModifier(partyMember.stats.con)}</span>
                <span>INT{formatAttributeModifier(partyMember.stats.int)}</span>
                <span>WIS{formatAttributeModifier(partyMember.stats.wis)}</span>
                <span>CHA{formatAttributeModifier(partyMember.stats.cha)}</span>

            </td>
        </tr>
            
        {/each}
        </tbody>
    </table>

</div>