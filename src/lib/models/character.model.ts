export interface Character {
	name: string;
	initiativeModifier: number;
	hp: number;
}

export interface Fighter extends Character {
	initiative: number;
	currentHp: number;
	rolled: number;
}

export interface PartyMember extends Character {
	class: string;
	ac: number;
	currentHp: number;
	speedFt: number;
	stats: {
		str?: number;
		dex?: number;
		con?: number;
		int?: number;
		wis?: number;
		cha?: number;
	};
	saves?: string[];
	skills?: string[];
	passive?: number;
	actions?: {
		name: string;
		text: string;
		attack?: string;
	}[];
}
