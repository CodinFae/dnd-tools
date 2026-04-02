export interface character {
	name: string;
	initiativeModifier: number;
	hp: number;
}

export interface turnCharacter extends character {
	initiative: number;
	currentHp: number;
}
