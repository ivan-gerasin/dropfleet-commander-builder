import BattleGroup from 'core/BattleGroup/BattleGroup';
import BattleGroupValidator from 'core/BattleGroup/BattleGroupValidator';
import BattleGroupType from 'core/BattleGroupType';
import Group from 'core/Group';
import TonnageClass from 'core/TonnageClass';
import MockRestrictionsExtractor from '../mocks/MockRestrictionsExtractor';
import SizedBattleGroupType from 'core/SizedBattleGroupType';
import GroupSizing from 'core/Sizing';
import UnitFactory from '../mocks/units';

describe('BattleGroupValidator', () => {
	let instance = new BattleGroupValidator()
	const MAX_BATTLE_GROUP_SIZE = 5;
	const sizedBattleGroupType = new SizedBattleGroupType(BattleGroupType.Line, GroupSizing.size(1, MAX_BATTLE_GROUP_SIZE));
	const mkExtractor = (min: number, max: number) => new MockRestrictionsExtractor(min, max)

	let group;
	let extractor: MockRestrictionsExtractor;

	const MIN_GROUPS_NUM = 1;
	const MAX_GROUPS_NUM = 3;

	describe('example with single tonnage class', () => {

		const EXAMPLE_TONNAGE_CLASS = TonnageClass.Medium

		const EXAMPLE_TONNAGE_UNIT = UnitFactory({tonnage: EXAMPLE_TONNAGE_CLASS})
		const GROUP_1 = Group.build(EXAMPLE_TONNAGE_UNIT, 1)

		beforeEach(() => {
			extractor = mkExtractor(MIN_GROUPS_NUM, MAX_GROUPS_NUM)
			extractor.allowedClasses = [EXAMPLE_TONNAGE_CLASS]
		})

		test('less groups than required', () => {
			group = new BattleGroup(sizedBattleGroupType, [], extractor)
			const errors = instance.validate(group)
			expect(errors).toHaveLength(extractor.allowedClasses.length)
			expect(errors[0]).toContain(
				`There is 0 of ${EXAMPLE_TONNAGE_CLASS} group(s), but at least ${MIN_GROUPS_NUM} required`
			)
		})

		test('have minimal such groups', () => {
			group = new BattleGroup(
				sizedBattleGroupType,
				(new Array(MIN_GROUPS_NUM)).fill(GROUP_1),
				extractor
			)
			const errors = instance.validate(group)
			expect(errors).toHaveLength(0)
		})

		test('have groups more than allowed', () => {
			group = new BattleGroup(
				sizedBattleGroupType,
				(new Array(MAX_GROUPS_NUM+1)).fill(GROUP_1),
				extractor
			)
			const errors = instance.validate(group)
			expect(errors).toHaveLength(1)
			expect(errors[0]).toContain(
				`There is ${MAX_GROUPS_NUM+1} of ${EXAMPLE_TONNAGE_CLASS} group(s), but only ${MAX_GROUPS_NUM} allowed`
			)
		})
	})

	test('Check for each allowed tonnage', () => {
		extractor = mkExtractor(MIN_GROUPS_NUM, MAX_GROUPS_NUM)
		extractor.allowedClasses = [
			TonnageClass.Light,
			TonnageClass.Medium,
			TonnageClass.Heavy,
			TonnageClass.SuperHeavy
		]
		group = new BattleGroup(
			sizedBattleGroupType,
			[],
			extractor
		)
		const errors = instance.validate(group)
		expect(errors).toHaveLength(extractor.allowedClasses.length)
	})

	test('Check for forbidden tonnage', () => {
		const EXAMPLE_ALLOWED_TONNAGE_CLASS = TonnageClass.Light
		const EXAMPLE_FORBIDDEN_TONNAGE_CLASS = TonnageClass.SuperHeavy
		extractor = mkExtractor(MIN_GROUPS_NUM, MAX_GROUPS_NUM)
		extractor.allowedClasses = [EXAMPLE_ALLOWED_TONNAGE_CLASS]

		const EXAMPLE_FORBIDDEN_TONNAGE_UNIT =
			UnitFactory({tonnage: EXAMPLE_FORBIDDEN_TONNAGE_CLASS})
		const GROUP_1 = Group.build(EXAMPLE_FORBIDDEN_TONNAGE_UNIT, 1)

		const EXAMPLE_ALLOWED_TONNAGE_UNIT =
			UnitFactory({tonnage: EXAMPLE_ALLOWED_TONNAGE_CLASS})
		const GROUP_2 = Group.build(EXAMPLE_ALLOWED_TONNAGE_UNIT, 1)

		group = new BattleGroup(
			sizedBattleGroupType,
			[GROUP_1, GROUP_2],
			extractor
		)
		const errors = instance.validate(group)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toContain(
			`${EXAMPLE_FORBIDDEN_TONNAGE_CLASS} tonnage class is forbidden in ${group.groupType.type} battle group type`
		)
	})

})