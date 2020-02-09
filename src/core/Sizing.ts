export default class GroupSizing {
	static size(val1: number, val2 = 0): GroupSizing {
		return new GroupSizing(Math.max(val1, val2), Math.min(val1, val2))
	}

	constructor(readonly max: number, readonly min: number = 0) {
		if (max < min) {
			throw new RangeError('Maximal size can non be lesser than minimal size')
		}
		if (max < 0 || min < 0) {
			throw new RangeError('Size can not be lesser than zero')
		}
	}
}
