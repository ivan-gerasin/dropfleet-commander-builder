import GroupSizing from 'core/Sizing';
import TonnageClass from 'core/TonnageClass';

enum BattleGroupType {
	Pathfinder = 'Pathfinder',
	Vanguard = 'Vanguard',
	Line = 'Line',
	Flag = 'Flag'
}

const PATHFINDER_TONNAGE_RESTRICTIONS = new Map<TonnageClass, GroupSizing>([
	[TonnageClass.Light, GroupSizing.size(1,3)],
	[TonnageClass.Medium, GroupSizing.size(1)],
])

const VANGUARD_TONNAGE_RESTRICTIONS = new Map<TonnageClass, GroupSizing>([
	[TonnageClass.Light, GroupSizing.size(1)],
	[TonnageClass.Medium, GroupSizing.size(1)],
	[TonnageClass.Heavy, GroupSizing.size(1, 2)]
])

const LINE_TONNAGE_RESTRICTIONS = new Map<TonnageClass, GroupSizing>([
	[TonnageClass.Light, GroupSizing.size(2)],
	[TonnageClass.Medium, GroupSizing.size(1, 3)],
])

const FLAG_TONNAGE_RESTRICTIONS = new Map<TonnageClass, GroupSizing>([
	[TonnageClass.Light, GroupSizing.size(1)],
	[TonnageClass.SuperHeavy, GroupSizing.size(1, 2)],
])


type TonnageRestrictions = Map<TonnageClass, GroupSizing>
const BATTLE_GROUP_TYPE_TONNAGE_RESTRICTIONS = new Map<BattleGroupType, TonnageRestrictions>([
	[BattleGroupType.Pathfinder,    PATHFINDER_TONNAGE_RESTRICTIONS],
	[BattleGroupType.Vanguard,      VANGUARD_TONNAGE_RESTRICTIONS],
	[BattleGroupType.Line,          LINE_TONNAGE_RESTRICTIONS],
	[BattleGroupType.Flag,          FLAG_TONNAGE_RESTRICTIONS]
])

export function getTonnageSizingForBattleGroup(battleGroup: BattleGroupType, tonnage: TonnageClass): GroupSizing {
	const battleGroupTonnageMap = BATTLE_GROUP_TYPE_TONNAGE_RESTRICTIONS.get(battleGroup)
	if (battleGroupTonnageMap) {
		const sizing = battleGroupTonnageMap.get(tonnage)
		if (sizing) {
			return sizing
		}
		throw ReferenceError(`Battle group ${battleGroup} does not allow groups with tonnage ${tonnage}`)
	}
	throw ReferenceError(`Such battle group does not exists: ${battleGroup}`);
}

export default BattleGroupType