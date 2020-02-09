import BattleGroupValidator from 'core/BattleGroup/BattleGroupValidator';
import {IValidated, IWithID, ValidationError} from 'core/CommonInterfaces';
import Group from 'core/Group/Group';
import SizedBattleGroupType from 'core/SizedBattleGroupType';
import GroupSizing from 'core/Sizing';
import TonnageClass from 'core/TonnageClass';
import ITonnageRestrictionsExtractor from 'core/TonnageRestrictionsExtractor';
import {without} from 'lodash';
import uuid from 'uuid/v4';

export default class BattleGroup implements IWithID, IValidated {

	readonly id = uuid();
	private readonly validator = new BattleGroupValidator()

	constructor(
		readonly groupType: SizedBattleGroupType,
		readonly groups: Array<Group> = [],
		readonly tonnageRestrictionsExtractor: ITonnageRestrictionsExtractor
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
		return this.tonnageRestrictionsExtractor.getTonnageSizingForBattleGroup(this.groupType.type, group.unit.tonnage)
	}

	getGroupsWithTonnage = (tonnage: TonnageClass): Array<Group> => {
		return this.groups.filter((group: Group) => group.unit.tonnage === tonnage)
	}

	private withUpdatedGroupList(groups: Array<Group>): BattleGroup {
		return new BattleGroup(this.groupType, groups, this.tonnageRestrictionsExtractor)
	}

	get size(): number {
		return this.groups.length;
	}

	get pointCost(): number {
		return this.groups
			.map((group: Group) => group.pointCost)
			.reduce((acc, groupCost) => acc+groupCost)
	}

	get isValid(): boolean {
		return this.validate().length === 0
	}

	validate(): Array<ValidationError> {
		return this.validator.validate(this)
	}

	addGroup(group: Group): BattleGroup {
		if (this.canAddGroup(group)) {
			return this.unsafeAddGroup(group)
		}
		throw new Error('Can not add new group to battle group')
	}

	unsafeAddGroup(group: Group): BattleGroup {
		return this.withUpdatedGroupList(this.groups.concat(group));
	}

	removeGroup(group: Group): BattleGroup {
		if (this.canRemoveGroup(group)) {
			return this.unsafeRemoveGroup(group);
		}
		throw new Error('Can not remove group from battle group')
	}

	unsafeRemoveGroup(group: Group): BattleGroup {
		const updateGroups = without(this.groups, group);
		if (updateGroups.length == this.groups.length) {
			throw new Error('DO NOT IGNORE: unsafeRemoveGroup method is not working')
		}
		return this.withUpdatedGroupList(updateGroups);
	}

}

