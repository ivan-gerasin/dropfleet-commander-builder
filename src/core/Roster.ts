import {compact} from 'lodash'

import BattleGroup from 'core/BattleGroup';
import Faction from 'core/Faction';
import GameSize, {defineGameSize} from 'core/GameSize';

export default class Roster {
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

	validatePointCost(): string | undefined {
		const total = this._battleGroups
			.map((group: BattleGroup) => group.pointCost)
			.reduce((acc, groupCost) => acc+groupCost);
		if (total>this.points) {
			return `You spent more points than selected ${this.points}`
		}
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
		throw new Error('not implemented')
	}

	removeBattleGroup(group: BattleGroup) {
		throw new Error('not implemented')
	}

}

type RosterValidationError = string