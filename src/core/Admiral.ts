import {IWithHash} from 'core/CommonInterfaces';
import Faction from 'core/Faction';
import GameSize from 'core/GameSize';
import hashSum from 'hash-sum';

export default class Admiral implements IWithHash<Admiral>{

	readonly hash: string;

	constructor(
		readonly faction: Faction,
		readonly name: string,
		readonly admiralValue: number,
		readonly allowedGameSize: Array<GameSize>,
		readonly points: number
	) {
		this.hash = hashSum(`admiral_${faction}_${name}_${points}`)
	}

	isEq(group: Admiral): boolean {
		return this.hash === group.hash
	}

}