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
	level?: number;
	size?: string;
	ac?: string;
	currentHp: number;
	speed?: string;
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
