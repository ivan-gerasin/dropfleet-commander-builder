import BattleGroupType from 'core/BattleGroupType';
import GroupSizing from 'core/Sizing';
import TonnageClass from 'core/TonnageClass';
import {getTonnageSizingForBattleGroup, BATTLE_GROUP_TYPE_TONNAGE_RESTRICTIONS} from 'core/BattleGroupType'

export type TonnageSizingExtrator = (type: BattleGroupType, tonnage: TonnageClass) => GroupSizing
export type AllowedTonnageExtrator = (battleGroup: BattleGroupType) => Array<TonnageClass>
export default interface ITonnageRestrictionsExtractor {
	getTonnageSizingForBattleGroup: TonnageSizingExtrator
	getAllowedTonnageClass: AllowedTonnageExtrator
}


export class BasicTonnageRestrictionsExtractor implements ITonnageRestrictionsExtractor{
	getTonnageSizingForBattleGroup(type: BattleGroupType, tonnage: TonnageClass): GroupSizing {
		return getTonnageSizingForBattleGroup(type, tonnage)
	}
	getAllowedTonnageClass(group: BattleGroupType): Array<TonnageClass> {
		const battleGroupTonnageMap = BATTLE_GROUP_TYPE_TONNAGE_RESTRICTIONS.get(group)
		if (battleGroupTonnageMap) {
			return Array.from(battleGroupTonnageMap.keys())
		}
		throw ReferenceError(`Such battle group does not exists: ${group}`);
	}
}

