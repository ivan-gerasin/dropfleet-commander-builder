import Faction from 'core/Faction';
import UnitSpecialTrait from 'core/UnitSpecialTrait';
import TonnageClass from 'core/TonnageClass';

type ScanRange = number
type SignatureRange = number
type Thrust = number
type HullPoints = number
type Armour = number
type PointDefence = number
export type GroupSize = number
export type PointCost = number

export interface IUnitData {
	name            : string
	faction         : Faction
	scan            : ScanRange
	signature       : SignatureRange
	thrust          : Thrust
	hull            : HullPoints
	armor           : Armour
	pointDefence    : PointDefence
	groupSize       : GroupSize
	tonnage         : TonnageClass
	pointCost       : PointCost
	special         : Array<UnitSpecialTrait>
}

class Unit {

	static build(unitData: IUnitData) {
		const {
			name, faction, scan, signature, thrust, hull, armor, pointDefence, groupSize, tonnage, pointCost, special
		} = unitData;
		return new Unit(
			name,
			faction,
			scan,
			signature,
			thrust,
			hull,
			armor,
			pointDefence,
			groupSize,
			tonnage,
			pointCost,
			special
		);
	}

	constructor(
		readonly name: string,
		readonly faction: Faction,
		readonly scan: ScanRange,
		readonly signature: SignatureRange,
		readonly thrust: Thrust,
		readonly hull: HullPoints,
		readonly armor: Armour,
		readonly pointDefence: PointDefence,
		readonly groupSize: GroupSize,
		readonly tonnage: TonnageClass,
		readonly pointCost: PointCost,
		readonly special: Array<UnitSpecialTrait> = []
	) {}
}

export default Unit