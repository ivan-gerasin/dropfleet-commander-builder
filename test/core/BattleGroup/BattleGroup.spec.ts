import BattleGroup from 'core/BattleGroup/BattleGroup';
import BattleGroupType from 'core/BattleGroupType';
import Group from 'core/Group/Group';
import MockRestrictionsExtractor from '../mocks/MockRestrictionsExtractor';
import UnitFactory, {UNIT_1} from '../mocks/units';
import SizedBattleGroupType from 'core/SizedBattleGroupType';
import GroupSizing from 'core/Sizing';
import TonnageClass from 'core/TonnageClass';

describe('BattleGroup spec', () => {
	const mkExtractor = (min: number, max: number) => new MockRestrictionsExtractor(min, max)

	const MAX_BATTLE_GROUP_SIZE = 3
	const sizedBattleGroupType = new SizedBattleGroupType(BattleGroupType.Line, GroupSizing.size(1, MAX_BATTLE_GROUP_SIZE));
	const NO_GROUPS: Array<Group> = []

	const GROUP_1 = new Group(UNIT_1)
	const GROUP_2 = new Group(UNIT_1)
	const GROUP_3 = new Group(UNIT_1)

	let instance: BattleGroup;

	test('size return number of groups', () => {
		instance = new BattleGroup(sizedBattleGroupType, NO_GROUPS, mkExtractor(1,3));
		expect(instance.size).toBe(0)

		instance = new BattleGroup(sizedBattleGroupType, [GROUP_1], mkExtractor(1,3));
		expect(instance.size).toBe(1)

		instance = new BattleGroup(sizedBattleGroupType, [
			GROUP_1, GROUP_2, GROUP_3
		], mkExtractor(1,3));
		expect(instance.size).toBe(3)
	});


	describe('addGroup method', () => {
		//instance = new BattleGroup(sizedBattleGroupType, NO_GROUPS, mkExtractor(1,3));

		test('throw error if battle group is full', () => {
			instance = new BattleGroup(sizedBattleGroupType, [
				GROUP_1, GROUP_2, GROUP_3
			], mkExtractor(1,3));

			const executor = () => instance.addGroup(new Group(UNIT_1));
			expect(executor).toThrow()

			instance = new BattleGroup(sizedBattleGroupType, [
				GROUP_1, GROUP_2
			], mkExtractor(1,3));
			const updatedBattleGroup = instance.addGroup(new Group(UNIT_1));
			expect(updatedBattleGroup.groups.length).toBe(3);
		})

		test('throw error if there is more groups with such tonnage than allowed', () => {
			const LIGHT_UNIT = UnitFactory({ tonnage: TonnageClass.Light });
			const HEAVY_UNIT = UnitFactory({tonnage: TonnageClass.Heavy});

			instance = new BattleGroup(sizedBattleGroupType, [
				new Group(LIGHT_UNIT),
			], mkExtractor(0,1));
			const executor = () => instance.addGroup(new Group(LIGHT_UNIT));
			expect(executor).toThrow()

			const updatedBattleGroup = instance.addGroup(new Group(HEAVY_UNIT))
			expect(updatedBattleGroup.groups.length).toBe(2);
		});
	});

	describe('removeGroup', () => {

		test('throw error if provided group does not exists in battle group', () => {
			instance = new BattleGroup(sizedBattleGroupType, [
				GROUP_1, GROUP_2
			], mkExtractor(1,3));
			const executor = () => instance.removeGroup(GROUP_3)
			expect(executor).toThrow()

			const updated = instance.removeGroup(GROUP_1)
			expect(updated.groups.length).toBe(1)
		});

		test('throw error if trying to remove required group', () => {
			instance = new BattleGroup(sizedBattleGroupType, [GROUP_1], mkExtractor(1,3));
			const executor = () => instance.removeGroup(GROUP_1)
			expect(executor).toThrow()
		});
	})
});