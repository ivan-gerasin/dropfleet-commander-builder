import BattleGroup from 'core/BattleGroup/BattleGroup';
import {ErrorOrNull, IValidated, IWithID} from 'core/CommonInterfaces';
import Faction from 'core/Faction';
import GameSize, {defineGameSize} from 'core/GameSize';
import {compact, without} from 'lodash'
import uuid from 'uuid/v4';

export default class Roster implements IWithID, IValidated {
	readonly id = uuid();

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

	private validatePointCost(): ErrorOrNull {
		const total = this._battleGroups
			.map((group: BattleGroup) => group.pointCost)
			.reduce((acc, groupCost) => acc+groupCost);
		if (total>this.points) {
			return `You spent more points than selected ${this.points}`
		}
		return null
	}

	private validateBattleGroupMaxPointCost(): ErrorOrNull {
		const maxAllowedSizeKoef = {
			[GameSize.Skirmish]: 0.5,
			[GameSize.Clash]: 0.33,
			[GameSize.Battle]: 0.33
		};
		const maxBattleGroupPointConst = Math.round(maxAllowedSizeKoef[this.gameSize]*this.points)
		const invalidGroups = this._battleGroups.filter((group) => group.pointCost > maxBattleGroupPointConst)
		if (invalidGroups.length) {
			const groupTypes = invalidGroups.map((group) => group.groupType.type.toString())
			return `You have ${groupTypes.length} overpriced groups: ${groupTypes.join((', '))}. Max price is: ${maxBattleGroupPointConst}`
		}
		return null
	}

	validate(): Array<RosterValidationError> {
		const validators = [
			this.validatePointCost
		];
		const errors = validators.map((validator) => validator());
		return compact(errors);
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