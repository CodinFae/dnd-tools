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
	const [current, max] = hp.split('/').map((v) => Number(v.trim()));
	return {
		currentHp: Number.isFinite(current) ? current : 0,
		hp: Number.isFinite(max) ? max : 1
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