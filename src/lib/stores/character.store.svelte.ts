import type { Character } from '../models/character.model';

export let characterStore = $state<Character[]>([]);

export const removeCharacter = (name: string) => {
	const filtered = characterStore.filter((a) => a.name !== name);

	characterStore.length = 0;
	characterStore.push(...filtered);
};

export const addCharacter = (character: Character) => {
	characterStore.push(character);
};
