import Group from 'core/Group/Group';
import {UNIT_1} from '../mocks/units';

describe('Group', () => {

	let instance: Group;
	test('hasFreeSlot returns true if allowed group size is greater than current', () => {
		instance = new Group(UNIT_1, 1)
		expect(instance.hasFreeSlot).toBeTruthy()

		instance = new Group(UNIT_1, UNIT_1.groupSize)
		expect(instance.hasFreeSlot).toBeFalsy()
	});

	test('pointCost return total cost of group', () => {
		instance = new Group(UNIT_1, 1)
		expect(instance.pointCost).toBe(UNIT_1.pointCost)

		instance = new Group(UNIT_1, 2)
		expect(instance.pointCost).toBe(UNIT_1.pointCost * 2)
	});

	test('increaseGroupSize return new instance with incremented size if it possible', () => {
		instance = new Group(UNIT_1, UNIT_1.groupSize-1)
		const updated = instance.increaseGroupSize()
		expect(updated.size).toBe(UNIT_1.groupSize)
		expect(updated).not.toBe(instance)
	});

	test('increaseGroupSize throw error if there is no free slots', () =>{
		instance = new Group(UNIT_1, UNIT_1.groupSize)
		const executor = () => instance.increaseGroupSize()
		expect(executor).toThrow()
	});

	test('decreaseGroupSize returns new instance with decremented size if possible', () => {
		instance = new Group(UNIT_1, UNIT_1.groupSize)
		const updated = instance.decreaseGroupSize()
		expect(updated.size).toBe(UNIT_1.groupSize-1)
		expect(updated).not.toBe(instance)
	});

	test('decreaseGroupSize throws error if there is only one ship on group', () => {
		instance = new Group(UNIT_1, 1)
		const executor = () => instance.decreaseGroupSize()
		expect(executor).toThrow()
	});

});