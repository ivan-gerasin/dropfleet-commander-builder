import Unit, { GroupSize } from 'core/Unit';

type BattleGroupType = string

class BattleGroup {
	constructor(
		readonly groups: Array<Group> = [],
		readonly groupType: BattleGroupType,
	){}
}



class Group {
	constructor(
		readonly unit: Unit,
		readonly size: GroupSize
	) {}
}