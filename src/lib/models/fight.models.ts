import type { Character, Fighter } from './character.model';

export interface Fight {
	fighters: Fighter[];
	currentTurn: number;
	currentCharacterIndex: number;
	phase: 'unset' | 'ready' | 'started' | 'paused';
	turnSeconds: number;
}
