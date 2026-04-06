export interface ParsedCharacter {
	label: string;
	class: string;
	level?: number;
	size?: string;
	ac?: string;
	hp?: string;
	speed?: string;
	init?: number;
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
