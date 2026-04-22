import type { PartyMember } from '../models/character.model';

export let partyStore = $state<PartyMember[]>([]);

export const removeCharacter = (name: string) => {
	const filtered = partyStore.filter((a) => a.name !== name);

	partyStore.length = 0;
	partyStore.push(...filtered);
};

export const addCharacter = (character: PartyMember) => {
	partyStore.push(character);
};
