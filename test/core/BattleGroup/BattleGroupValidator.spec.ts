import BattleGroup from 'core/BattleGroup/BattleGroup';
import BattleGroupValidator from 'core/BattleGroup/BattleGroupValidator';
import BattleGroupType from 'core/BattleGroupType';
import MockRestrictionsExtractor from '../mocks/MockRestrictionsExtractor';
import SizedBattleGroupType from 'core/SizedBattleGroupType';
import GroupSizing from 'core/Sizing';

describe('BattleGroupValidator', () => {
	let instance = new BattleGroupValidator()
	const MAX_BATTLE_GROUP_SIZE = 3;
	const sizedBattleGroupType = new SizedBattleGroupType(BattleGroupType.Line, GroupSizing.size(1, MAX_BATTLE_GROUP_SIZE));
	const mkExtractor = (min: number, max: number) => new MockRestrictionsExtractor(min, max)

	let group = new BattleGroup(sizedBattleGroupType, [], mkExtractor(1,3))

})