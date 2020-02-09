import BattleGroup from 'core/BattleGroup/BattleGroup'
import BattleGroupType from 'core/BattleGroupType'
import Faction from 'core/Faction'
import Group from 'core/Group/Group'
import UnitFactory from '../mocks/units'
import RosterValidator from 'core/Roster/RosterValidator'
import MockRestrictionsExtractor from '../mocks/MockRestrictionsExtractor'
import Roster from 'core/Roster/Roster'
import SizedBattleGroupType from 'core/SizedBattleGroupType'
import GroupSizing from 'core/Sizing'

describe('RosterValidator', () => {
	const mkExtractor = (min: number, max: number): MockRestrictionsExtractor => new MockRestrictionsExtractor(min, max)
	const sizedBattleGroupType = new SizedBattleGroupType(BattleGroupType.Line, GroupSizing.size(1, 5))

	let roster

	const validator = new RosterValidator()
	test('return error if roster cost is more than game size', () => {
		const ROSTER_POINT_COST = 999
		roster = new Roster('test', ROSTER_POINT_COST, Faction.PHR)
		const UNIT = UnitFactory({ pointCost: 500 })
		const BG_1 = new BattleGroup(sizedBattleGroupType, [new Group(UNIT)], mkExtractor(1, 3))
		const BG_2 = new BattleGroup(sizedBattleGroupType, [new Group(UNIT)], mkExtractor(1, 3))
		roster.addBattleGroup(BG_1).addBattleGroup(BG_2)
		const errors = validator.validate(roster)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toEqual(`You spent more points than selected ${ROSTER_POINT_COST}`)
	})

	test('return error if battlegroup size more that allowed', () => {
		const ROSTER_POINT_COST = 999
		roster = new Roster('test', ROSTER_POINT_COST, Faction.PHR)
		const UNIT = UnitFactory({ pointCost: 800 })
		const BG_1 = new BattleGroup(sizedBattleGroupType, [new Group(UNIT)], mkExtractor(1, 3))
		roster.addBattleGroup(BG_1)
		const errors = validator.validate(roster)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toContain(`You have 1 overpriced groups: ${BG_1.groupType.type}. Max price is:`)
	})
})
