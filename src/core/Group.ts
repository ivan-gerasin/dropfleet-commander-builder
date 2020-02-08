import {IWithHash} from 'core/CommonInterfaces';
import uuid from 'uuid/v4';
import hashSum from 'hash-sum';

import Unit, {GroupSize, PointCost} from 'core/Unit';

export default class Group implements IWithHash {
	readonly id = uuid();
	readonly hash: string;
	constructor(
		readonly unit: Unit,
		readonly size: GroupSize = 1
	) {
		this.hash = hashSum(`${unit.name}_${size}`)
	}

	static build(unit: Unit, size: GroupSize) {
		return new Group(unit, size);
	}

	// get hash(): string {
	// 	return this._hash
	// }

	private changeSize(size: GroupSize): Group {
		return new Group(this.unit, size);
	}

	get hasFreeSlot(): boolean {
		return this.unit.groupSize > this.size
	}

	get pointCost(): PointCost {
		return this.unit.pointCost * this.size
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