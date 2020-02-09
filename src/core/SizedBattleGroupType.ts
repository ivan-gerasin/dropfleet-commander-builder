import BattleGroupType from 'core/BattleGroupType'
import GroupSizing from 'core/Sizing'

export default class SizedBattleGroupType {
	constructor(readonly type: BattleGroupType, private readonly sizing: GroupSizing) {}

	get max(): number {
		return this.sizing.max
	}

	get min(): number {
		return this.sizing.min
	}
}
