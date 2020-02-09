import BattleGroupType from 'core/BattleGroupType'
import GroupSizing from 'core/Sizing'
import TonnageClass from 'core/TonnageClass'
import ITonnageRestrictionsExtractor from 'core/TonnageRestrictionsExtractor'

export default class MockRestrictionsExtractor implements ITonnageRestrictionsExtractor {
	private readonly sizing: GroupSizing
	allowedClasses: Array<TonnageClass> = [
		TonnageClass.Light,
		TonnageClass.Medium,
		TonnageClass.Heavy,
		TonnageClass.SuperHeavy
	]

	constructor(public min: number, public max: number) {
		this.sizing = GroupSizing.size(min, max)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getTonnageSizingForBattleGroup = (type: BattleGroupType, tonnage: TonnageClass): GroupSizing => {
		return this.sizing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getAllowedTonnageClass(group: BattleGroupType): Array<TonnageClass> {
		return this.allowedClasses
	}
}
