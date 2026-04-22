<script>
    import {partyStore} from "$lib/stores/party.store.svelte"
	import { feetToSquare } from "$lib/utils/dnd.utils";
	import { formatModifier, formatAttributeModifier } from "$lib/utils/format.utils";
</script>

<div class="overflow-auto">
    <table class="table">
        <thead>
            <tr>
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
                    Speed
                </th>
                <th>
                    Attributes
                </th>
            </tr>
        </thead>
        <tbody>

        {#each partyStore.toSorted((a,b) => a.name.localeCompare(b.name)) as partyMember}
        <tr>
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
                {feetToSquare(partyMember.speed)} sq
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