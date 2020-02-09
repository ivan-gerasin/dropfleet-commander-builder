import BattleGroup from 'core/BattleGroup/BattleGroup'
import GameSize from 'core/GameSize'
import Roster from 'core/Roster/Roster'
import { compact } from 'lodash'
import { ErrorOrNull, IClassValidator, ValidationError } from 'core/CommonInterfaces'

export default class RosterValidator implements IClassValidator<Roster> {
	validate(that: Roster): Array<ValidationError> {
		return compact([this.validateBattleGroupMaxPointCost(that), this.validatePointCost(that)])
	}

	private validatePointCost(that: Roster): ErrorOrNull {
		const total = that.battleGroups
			.map((group: BattleGroup) => group.pointCost)
			.reduce((acc, groupCost) => acc + groupCost)
		if (total > that.points) {
			return `You spent more points than selected ${that.points}`
		}
		return null
	}

	private validateBattleGroupMaxPointCost(that: Roster): ErrorOrNull {
		const maxAllowedSizeKoef = {
			[GameSize.Skirmish]: 0.5,
			[GameSize.Clash]: 0.33,
			[GameSize.Battle]: 0.33
		}
		const maxBattleGroupPointConst = Math.round(maxAllowedSizeKoef[that.gameSize] * that.points)
		const invalidGroups = that.battleGroups.filter(group => group.pointCost > maxBattleGroupPointConst)
		if (invalidGroups.length) {
			const groupTypes = invalidGroups.map(group => group.groupType.type.toString())
			return `You have ${groupTypes.length} overpriced groups: ${groupTypes.join(
				', '
			)}. Max price is: ${maxBattleGroupPointConst}`
		}
		return null
	}
}
