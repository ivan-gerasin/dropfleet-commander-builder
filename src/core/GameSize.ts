import BattleGroupType from 'core/BattleGroupType';

enum GameSize {
	Skirmish = 'Skirmish',
	Clash = 'Clash',
	Battle = 'Battle'
}

const SKIRMISH_MIN = 500;
const SKIRMISH_MAX = 999;
const CLASH_MIN = 1000;
const CLASH_MAX = 1999;
const BATTLE_MIN = 2000;
const BATTLE_MAX = 3000;

export function defineGameSize(points: number): GameSize {
	if (points < SKIRMISH_MIN) {
		throw new RangeError('Game points size too small')
	}
	if (points >= SKIRMISH_MIN && points <= SKIRMISH_MAX) {
		return GameSize.Skirmish
	}
	if (points >= CLASH_MIN && points <= CLASH_MAX) {
		return GameSize.Clash
	}
	if (points >= BATTLE_MIN && points <= BATTLE_MAX) {
		return GameSize.Battle
	}
	throw new RangeError('Game points too high')
}

const SKIRMISH_MAX_GROUPS_TOTAL = 4;
const CLASH_MAX_GROUPS_TOTAL = 6;
const BATTLE_MAX_GROUPS_TOTAL = 7;

const MAX_GROUPS_FOR_GAME_SIZE = new Map<GameSize, number>({
	[GameSize.Skirmish] : SKIRMISH_MAX_GROUPS_TOTAL,
	[GameSize.Clash]    : CLASH_MAX_GROUPS_TOTAL,
	[GameSize.Battle]   : BATTLE_MAX_GROUPS_TOTAL,
});

export function maxGroupsForGameSize()

type GroupNumbersMapping = Map<BattleGroupType, GroupSizing>;

class GroupSizing {

	static size(max: number, min: number = 0): GroupSizing {
		return new GroupSizing(max, min)
	}

	constructor(
		readonly max: number,
		readonly min: number = 0
	) {
		if (max < min) {
			throw new RangeError('Maximal size can non be lesser than minimal size')
		}
		if (max < 0 || min < 0) {
			throw new RangeError('Size can not be lesser than zero')
		}
	}
}

const SKIRMISH_GROUPS_NUMBERS: GroupNumbersMapping = new Map<BattleGroupType, GroupSizing>([
	[BattleGroupType.Pathfinder,    GroupSizing.size(2)],
	[BattleGroupType.Line,          GroupSizing.size(2,1)],
	[BattleGroupType.Vanguard,      GroupSizing.size(1)],
	[BattleGroupType.Flag,          GroupSizing.size(0)]
]);

const CLASH_GROUPS_NUMBERS: GroupNumbersMapping = new Map<BattleGroupType, GroupSizing>([
	[BattleGroupType.Pathfinder,    GroupSizing.size(2, 1)],
	[BattleGroupType.Line,          GroupSizing.size(3,1)],
	[BattleGroupType.Vanguard,      GroupSizing.size(2)],
	[BattleGroupType.Flag,          GroupSizing.size(1)]
]);

const BATTLE_GROUPS_NUMBERS: GroupNumbersMapping = new Map<BattleGroupType, GroupSizing>([
	[BattleGroupType.Pathfinder,   GroupSizing.size(3, 1)],
	[BattleGroupType.Line,          GroupSizing.size(4,1)],
	[BattleGroupType.Vanguard,      GroupSizing.size(3)],
	[BattleGroupType.Flag,          GroupSizing.size(2)]
]);

const GAME_SIZE_BATTLE_GROUPS_MAPPING = new Map<GameSize, GroupNumbersMapping>([
	[GameSize.Skirmish, SKIRMISH_GROUPS_NUMBERS],
	[GameSize.Clash,    CLASH_GROUPS_NUMBERS],
	[GameSize.Battle,   BATTLE_GROUPS_NUMBERS]
]);

export function getMaximumOfBattleGroupsType(gameSize: GameSize, groupType: BattleGroupType): GroupSizing {
	const groupMapping =GAME_SIZE_BATTLE_GROUPS_MAPPING.get(gameSize);
	if (groupMapping) {
		if (groupMapping.has(groupType)) {
			return groupMapping.get(groupType);
		}
		throw new ReferenceError(`No such group type ${groupType}`);
	}
	throw new ReferenceError(`No such game size mapping: ${gameSize}`);
}

export default GameSize