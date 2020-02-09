import BattleGroup from 'core/BattleGroup/BattleGroup'
import BattleGroupType from 'core/BattleGroupType'
import Faction from 'core/Faction'
import GameSize from 'core/GameSize'
import MockRestrictionsExtractor from '../mocks/MockRestrictionsExtractor'
import Roster from 'core/Roster/Roster'
import SizedBattleGroupType from 'core/SizedBattleGroupType'
import GroupSizing from 'core/Sizing'

describe('Roster', () => {
	const mkExtractor = (min: number, max: number): MockRestrictionsExtractor => new MockRestrictionsExtractor(min, max)
	const sizedBattleGroupType = new SizedBattleGroupType(BattleGroupType.Line, GroupSizing.size(1, 5))

	let roster
	const BG_1 = new BattleGroup(sizedBattleGroupType, [], mkExtractor(1, 3))

	test('gameSize method return game size enum value', () => {
		roster = new Roster('test', 999, Faction.PHR)
		expect(roster.gameSize).toBe(GameSize.Skirmish)

		roster = new Roster('test', 1999, Faction.PHR)
		expect(roster.gameSize).toBe(GameSize.Clash)

		roster = new Roster('test', 2000, Faction.PHR)
		expect(roster.gameSize).toBe(GameSize.Battle)
	})

	test('addBattleGroup returns same roster instance and add battleGroup', () => {
		roster = new Roster('test', 999, Faction.PHR)
		expect(roster.battleGroups.length).toBe(0)
		expect(roster.addBattleGroup(BG_1)).toBe(roster)
		expect(roster.battleGroups.length).toBe(1)
	})

	test('battleGroups return copy of internal value', () => {
		roster = new Roster('test', 999, Faction.PHR)
		roster.addBattleGroup(BG_1)
		expect(roster.battleGroups).not.toBe(roster.battleGroups)
		expect(roster.battleGroups).toEqual(roster.battleGroups)
	})

	test('removeBattleGroup returns same roster instance and remove battleGroup', () => {
		roster = new Roster('test', 999, Faction.PHR)
		roster.addBattleGroup(BG_1)
		expect(roster.battleGroups.length).toBe(1)
		expect(roster.removeBattleGroup(BG_1)).toBe(roster)
		expect(roster.battleGroups.length).toBe(0)
	})
})
