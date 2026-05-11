import { PartyMemberSchema, type PartyMember } from '$lib/models/character.model';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
	ignoreAttributes: false,
	parseTagValue: false, // keep raw strings (we'll control parsing)
	trimValues: true
});

export function parseXML(xmlString: string) {
	const result = parser.parse(xmlString);

	const pcs = result?.characters?.pc ?? result?.pc;

	if (!pcs) return [];

	return Array.isArray(pcs) ? pcs : [pcs];
}

const toNumber = (value: unknown, fallback = 0): number => {
	if (typeof value === 'number') return value;
	if (typeof value === 'string') {
		const match = value.match(/-?\d+/);
		if (match) return Number(match[0]);
	}
	return fallback;
};

const toArray = <T>(value: T | T[] | undefined): T[] => {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
};

const parseHp = (hp: string) => {
	console.info('Parsing HP:', hp);
	// Format is current/max (2D20)
	// First select via regex to ensure we have the correct format, then split and parse numbers
	const hpMatch = hp.match(/((\d+)\/(\d+))/);
	if (!hpMatch) {
		console.warn('HP format is invalid, defaulting to 0/1:', hp);
		return { currentHp: 0, hp: 1 };
	}
	console.debug('HP regex match:', hpMatch);
	console.info('Parsed HP values:', { current: Number(hpMatch[2]), max: Number(hpMatch[3]) });
	return {
		currentHp: Number.isFinite(Number(hpMatch[2])) ? Number(hpMatch[2]) : 0,
		hp: Number.isFinite(Number(hpMatch[3])) ? Number(hpMatch[3]) : 1
	};
};


export function transformCharacter(raw: any): PartyMember {
    console.log('Raw character data:', raw);
	const hpData = parseHp(raw.hp ?? '');

	const character = {
		name: raw.label ?? '',
		class: (raw.name ?? '').replaceAll('[2024]', '').trim(),
		ac: toNumber(raw.ac),
		speedFt: toNumber(raw.speed),
		initiativeModifier: toNumber(raw.init),

		...hpData,

		stats: {
			str: toNumber(raw.str),
			dex: toNumber(raw.dex),
			con: toNumber(raw.con),
			int: toNumber(raw.int),
			wis: toNumber(raw.wis),
			cha: toNumber(raw.cha)
		},

		saves: toArray(raw.save),
		skills: toArray(raw.skill),
		passive: toNumber(raw.passive),

		actions: toArray(raw.action).map((a: any) => ({
			name: a.name ?? '',
			text: a.text ?? '',
			...(a.attack && { attack: a.attack })
		}))
	};

	const result = PartyMemberSchema.safeParse(character);

	if (!result.success) {
		console.error(result.error.format());
		throw new Error(`Invalid character: ${character.name}`);
	}

	return result.data;
}