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

import { z } from 'zod';

export const PartyMemberSchema = z.object({
	name: z.string().min(1),
	class: z.string().min(1),
	ac: z.number().int().min(0),
	hp: z.number().int().min(1),
	currentHp: z.number().int().min(0),
	speedFt: z.number().int().min(0),
	initiativeModifier: z.number().int(),
	stats: z.object({
		str: z.number(),
		dex: z.number(),
		con: z.number(),
		int: z.number(),
		wis: z.number(),
		cha: z.number()
	}),
	saves: z.array(z.string()),
	skills: z.array(z.string()),
	passive: z.number(),
	actions: z.array(
		z.object({
			name: z.string(),
			text: z.string(),
			attack: z.string().optional()
		})
	)
});

export type PartyMember = z.infer<typeof PartyMemberSchema>;