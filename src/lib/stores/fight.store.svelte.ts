import type { character } from "$lib/models/character.model";
import type { Fight } from "$lib/models/fight.models";


export let fightStore = $state<Fight>({
    currentTurn: 0,
    fighters: []
})

export const setupFight = (characters: character[]) => {

    fightStore.fighters = characters
		.map((char) => {
			const rolled = Math.floor(Math.random() * 20) + 1;
			return {
				...char,
				rolled: rolled,
				initiative: char.initiativeModifier + rolled,
				currentHp: char.hp
			};
		})
		.sort((a, b) => b.initiative - a.initiative);
}