import type { Character } from '$lib/models/character.model';
import type { Fight } from '$lib/models/fight.models';

const DEFAULT_STATE_FIGHT = {
	phase: 'unset',
	fighters: [],
	currentTurn: 0,
	currentCharacterIndex: 0,
	turnSeconds: 0
} satisfies Fight;

const turnTimer = setInterval(() => {
	if (fightStore.phase == 'started') {
		fightStore.turnSeconds++;
	}
}, 1000);

export let fightStore = $state<Fight>(DEFAULT_STATE_FIGHT);

export const setupFight = (characters: Character[]) => {
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
	fightStore.phase = 'ready';
};

export const startFight = () => {
	if (fightStore.phase == 'unset') {
		throw 'Fight is not setup';
	} else if (fightStore.phase == 'started') {
		throw 'Fight is already running';
	}

	fightStore.currentTurn = 1;
	fightStore.currentCharacterIndex = 0;
	fightStore.turnSeconds = 0;
	fightStore.phase = 'started'
};

export const pauseFight = () => {
	fightStore.phase = 'paused';
};

export const resumeFight = () => {
	fightStore.phase = 'started';
};

export const stopFight = () => {
	fightStore.currentCharacterIndex = DEFAULT_STATE_FIGHT.currentCharacterIndex;
	fightStore.currentTurn = DEFAULT_STATE_FIGHT.currentTurn;
	fightStore.fighters = DEFAULT_STATE_FIGHT.fighters;
	fightStore.phase = DEFAULT_STATE_FIGHT.phase;
	fightStore.turnSeconds = DEFAULT_STATE_FIGHT.turnSeconds;
};

export const advanceCharacter = () => {
	if (fightStore.phase != 'started') {
		throw 'No fight in store';
	}

	const newPlayerIndex = fightStore.currentCharacterIndex + 1;

	if (newPlayerIndex >= fightStore.fighters.length) {
		fightStore.currentCharacterIndex = 0;
		fightStore.currentTurn++;
	} else {
		fightStore.currentCharacterIndex = newPlayerIndex;
	}
	fightStore.turnSeconds = 0
};
