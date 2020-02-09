import {IValidated, IWithHash, ValidationError} from 'core/CommonInterfaces';
import GroupValidator from 'core/Group/GroupValidator';
import uuid from 'uuid/v4';
import hashSum from 'hash-sum';

import Unit, {GroupSize, PointCost} from 'core/Unit';

export default class Group implements IWithHash<Group>, IValidated {
	readonly id = uuid();
	readonly hash: string;
	private readonly validator = new GroupValidator()
	constructor(
		readonly unit: Unit,
		readonly size: GroupSize = 1
	) {
		this.hash = hashSum(`${unit.name}_${size}`)
	}

	static build(unit: Unit, size: GroupSize) {
		return new Group(unit, size);
	}

	private changeSize(size: GroupSize): Group {
		return new Group(this.unit, size);
	}

	get hasFreeSlot(): boolean {
		return this.unit.groupSize > this.size
	}

	get pointCost(): PointCost {
		return this.unit.pointCost * this.size
	}

	isEq(group: Group): boolean {
		return this.hash === group.hash
	}

	get isValid(): boolean {
		return this.validate().length === 0;
	}

	validate(): Array<ValidationError> {
		return this.validator.validate(this)
	}

	increaseGroupSize(): Group {
		if (this.hasFreeSlot) {
			return this.changeSize(this.size + 1)
		}
		throw new RangeError('No free slots in for ship in this group')
	}

	decreaseGroupSize(): Group {
		if (this.size > 1) {
			return this.changeSize(this.size - 1)
		}
		throw new RangeError('Group size can not be zero')
	}
}