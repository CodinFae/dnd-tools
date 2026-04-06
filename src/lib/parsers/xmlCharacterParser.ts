import type { ParsedCharacter } from '../../models/character';

export function parseXMLCharacter(xmlString: string): ParsedCharacter[] {
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

	// Check for parsing errors
	if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
		throw new Error('Invalid XML file');
	}

	const characters: ParsedCharacter[] = [];
	const pcElements = xmlDoc.getElementsByTagName('pc');

	for (let i = 0; i < pcElements.length; i++) {
		const pc = pcElements[i];
		const character = parseCharacterElement(pc);
		characters.push(character);
	}

	return characters;
}

function parseCharacterElement(element: Element): ParsedCharacter {
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
	const character: ParsedCharacter = {
		label: getText('label'),
		class: getText('name').replaceAll("[2024]", "").trim(),
		level: getNumber('level'),
		size: getText('size') || undefined,
		ac: getText('ac') || undefined,
		hp: parseInt(hpString.split('/')[1]),
		currentHp: parseInt(hpString.split('/')[0]),
		speed: getText('speed') || undefined,
		init: getNumber('init'),
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

function parseActions(element: Element): ParsedCharacter['actions'] {
	const actionElements = element.querySelectorAll('action');
	const actions: ParsedCharacter['actions'] = [];

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

export function validateCharacter(character: ParsedCharacter): string[] {
	const errors: string[] = [];

	if (!character.label) {
		errors.push('Character label is required');
	}
	if (!character.class) {
		errors.push('Character name is required');
	}

	return errors;
}
