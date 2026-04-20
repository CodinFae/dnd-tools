import type { character, turnCharacter } from "./character.model";

export interface Fight{
    fighters: turnCharacter[],
    currentTurn: number,
}