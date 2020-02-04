import {defaults} from 'lodash';

import Faction from 'core/Faction';
import TonnageClass from 'core/TonnageClass';
import Unit, {IUnitData} from 'core/Unit';

export const UNIT_1 = Unit.build({
	name: 'Test unit',
	faction: Faction.PHR,
	scan: 1,
	signature: 1,
	thrust: 1,
	hull: 1,
	armor: 1,
	pointDefence: 1,
	groupSize: 3,
	tonnage: TonnageClass.Heavy,
	pointCost: 1,
	special: []
});

const defaultUnitData = {
	name: 'Test unit',
	faction: Faction.PHR,
	scan: 1,
	signature: 1,
	thrust: 1,
	hull: 1,
	armor: 1,
	pointDefence: 1,
	groupSize: 3,
	tonnage: TonnageClass.Light,
	pointCost: 1,
	special: []
};

export default function UnitFactory(data: Partial<IUnitData> = defaultUnitData) {
	return Unit.build(defaults(data, defaultUnitData))
}
