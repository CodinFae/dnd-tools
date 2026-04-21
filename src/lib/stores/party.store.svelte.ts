import type { PartyMember } from '../models/character.model';

export let party = $state<PartyMember[]>([]);

export const removeCharacter = (name: string) => {
	const filtered = party.filter((a) => a.name !== name);

	party.length = 0;
	party.push(...filtered);
};

export const addCharacter = (character: PartyMember) => {
	party.push(character);
};
