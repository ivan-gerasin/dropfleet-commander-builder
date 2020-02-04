import uuid from 'uuid/v4';

import Unit, {GroupSize, PointCost} from 'core/Unit';

export default class Group {
	readonly id = uuid();

	constructor(
		readonly unit: Unit,
		readonly size: GroupSize = 1
	) {
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