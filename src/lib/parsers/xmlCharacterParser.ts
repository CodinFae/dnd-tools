import type { PartyMember } from '../models/character.model';

export function parseXMLCharacter(xmlString: string): PartyMember[] {
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

	// Check for parsing errors
	if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
		throw new Error('Invalid XML file');
	}

	const characters: PartyMember[] = [];
	const pcElements = xmlDoc.getElementsByTagName('pc');

	for (let i = 0; i < pcElements.length; i++) {
		const pc = pcElements[i];
		const character = parseCharacterElement(pc);
		characters.push(character);
	}

	return characters;
}

function parseCharacterElement(element: Element): PartyMember {
	const getText = (tag: string, defaultValue?: string): string => {
		const el = element.querySelector(tag);
		return el?.textContent?.trim() || defaultValue || '';
	};

	const getNumber = (tag: string): number => {
		const val = getText(tag);
		return parseInt(val, 10);
	};

	const getArrayOfTag = (tag: string): string[] => {
		const elements = element.querySelectorAll(tag);
		const results: string[] = [];
		elements.forEach((el) => {
			const text = el.textContent?.trim();
			if (text) results.push(text);
		});
		return results;
	};

	const actions = parseActions(element);

	const hpString = getText('hp');
	const character: PartyMember = {
		name: getText('label'),
		class: getText('name').replaceAll('[2024]', '').trim(),
		ac: parseInt(getText('ac').slice(0,2)),
		hp: parseInt(hpString.split('/')[1]),
		currentHp: parseInt(hpString.split('/')[0]),
		speedFt: parseInt(getText('speed')),
		initiativeModifier: getNumber('init'),
		stats: {
			str: getNumber('str'),
			dex: getNumber('dex'),
			con: getNumber('con'),
			int: getNumber('int'),
			wis: getNumber('wis'),
			cha: getNumber('cha')
		},
		saves: getArrayOfTag('save'),
		skills: getArrayOfTag('skill'),
		passive: getNumber('passive'),
		actions
	};

	return character;
}

function parseActions(element: Element): PartyMember['actions'] {
	const actionElements = element.querySelectorAll('action');
	const actions: PartyMember['actions'] = [];

	actionElements.forEach((action) => {
		const name = action.querySelector('name')?.textContent?.trim() || '';
		const text = action.querySelector('text')?.textContent?.trim() || '';
		const attack = action.querySelector('attack')?.textContent?.trim();

		actions.push({
			name,
			text,
			...(attack && { attack })
		});
	});

	return actions;
}

const parseSpeed = (speedStat : string) : number => {
		if (!speedStat) return 0;
		const match = speedStat.match(/(\d+)/);
		if (!match) return 0;
		const feet = parseFloat(match[1]);
		return feet;
}

export function validateCharacter(character: PartyMember): string[] {
	const errors: string[] = [];

	if (!character.name) {
		errors.push('Character label is required');
	}
	if (!character.class) {
		errors.push('Character name is required');
	}

	return errors;
}
