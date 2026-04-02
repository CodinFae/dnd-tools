import type { character } from "./character.model";

export let characterStore = $state<character[]>([])

export const removeCharacter = (name: string) => {
    const filtered = characterStore.filter(a => a.name !== name)

    characterStore.length = 0
    characterStore.push(...filtered)
}