export interface character {
	name: string;
	initiativeModifier: number;
	hp: number;
}

export interface turnCharacter extends character {
	initiative: number;
	currentHp: number;
}


export interface ParsedCharacter extends character {
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
