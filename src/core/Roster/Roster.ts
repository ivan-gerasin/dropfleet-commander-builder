import BattleGroup from 'core/BattleGroup/BattleGroup';
import {IValidated, IWithID} from 'core/CommonInterfaces';
import Faction from 'core/Faction';
import GameSize, {defineGameSize} from 'core/GameSize';
import RosterValidator from 'core/Roster/RosterValidator';
import {without} from 'lodash'
import uuid from 'uuid/v4';

export default class Roster implements IWithID, IValidated {
	readonly id = uuid();
	private validator = new RosterValidator();

	constructor(
		public name: string,
		readonly points: number,
		readonly faction: Faction
	) {}

	private _battleGroups: Array<BattleGroup> = []

	get gameSize(): GameSize {
		return defineGameSize(this.points)
	}

	get isValid(): boolean {
		return this.validate().length === 0;
	}


	validate(): Array<RosterValidationError> {
		return this.validator.validate(this)
	}

	get battleGroups(): Array<BattleGroup> {
		return this._battleGroups.concat()
	}

	addBattleGroup(group: BattleGroup) {
		this._battleGroups = this._battleGroups.concat(group)
		return this
	}

	removeBattleGroup(group: BattleGroup) {
		this._battleGroups = without(this._battleGroups, group)
		return this
	}

}

type RosterValidationError = string