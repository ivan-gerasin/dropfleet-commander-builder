import uuid from 'uuid/v4';
import { without } from 'lodash';

import BattleGroupType, {getTonnageSizingForBattleGroup} from 'core/BattleGroupType';
import SizedBattleGroupType from 'core/SizedBattleGroupType';
import GroupSizing from 'core/Sizing';
import TonnageClass from 'core/TonnageClass';
import Unit, { GroupSize, PointCost } from 'core/Unit';

export type TonnageSizingExtractor = (type: BattleGroupType, tonnage: TonnageClass) => GroupSizing

export default class BattleGroup {

	readonly id = uuid();

	constructor(
		readonly groupType: SizedBattleGroupType,
		readonly groups: Array<Group> = [],
		private readonly tonnageRestrictionsExtractor: TonnageSizingExtractor = getTonnageSizingForBattleGroup
	){}

	private canAddGroup(group: Group): boolean {
		if (this.size >= this.groupType.max) {
			return false;
		}
		const groupsWithTonnage = this.getGroupsWithTonnage(group.unit.tonnage)
		const sizing = this.getSizingForGroup(group)
		return sizing.max > groupsWithTonnage.length
	}

	private canRemoveGroup(group: Group): boolean {
		if (!this.groups.includes(group)) {
			return false
		}
		const groupsWithTonnage = this.getGroupsWithTonnage(group.unit.tonnage)
		const sizing = this.getSizingForGroup(group)
		return sizing.min < groupsWithTonnage.length
	}

	private getSizingForGroup(group: Group): GroupSizing {
		return this.tonnageRestrictionsExtractor(this.groupType.type, group.unit.tonnage)
	}

	private getGroupsWithTonnage(tonnage: TonnageClass): Array<Group> {
		return this.groups.filter((group: Group) => group.unit.tonnage === tonnage)
	}

	private withUpdatedGroupList(groups: Array<Group>): BattleGroup {
		return new BattleGroup(this.groupType, groups)
	}

	get size(): number {
		return this.groups.length;
	}

	addGroup(group: Group): BattleGroup {
		if (this.canAddGroup(group)) {
			return this.withUpdatedGroupList(this.groups.concat(group));
		}
		throw new Error('Can not add new group to battle group')
	}

	removeGroup(group: Group): BattleGroup {
		if (this.canRemoveGroup(group)) {
			const updateGroups = without(this.groups, group);
			if (updateGroups.length == this.groups.length) {
				throw new Error('DO NOT IGNORE: removeGroup method is not working')
			}
			return this.withUpdatedGroupList(updateGroups);
		}
		throw new Error('Can not remove group from battle group')
	}

}

export class Group {
	readonly id = uuid();

	constructor(
		readonly unit: Unit,
		readonly size: GroupSize = 1
	) {}

	private changeSize(size: GroupSize): Group {
		return new Group(this.unit, size);
	}

	get hasFreeSlot(): boolean {
		return this.unit.groupSize < this.size
	}

	get pointCost(): PointCost {
		return this.unit.pointCost * this.size
	}

	increaseGroupSize(): Group {
		if (this.hasFreeSlot) {
			return this.changeSize(this.size+1)
		}
		throw new RangeError('No free slots in for ship in this group')
	}

	decreaseGroupSize(): Group {
		if (this.size > 1) {
			return this.changeSize(this.size-1)
		}
		throw new RangeError('Group size can not be zero')
	}
}