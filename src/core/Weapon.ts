import uuid from 'uuid/v4';
import WeaponSpecialTrait from 'core/WeaponSpecialTrait';

type Lock = number
type Attack = number
type Damage = number
type Arc = string

export interface IWeapon {
	name: string,
	lock: Lock,
	attack: Attack,
	damage: Damage,
	arc: Arc,
	special: Array<WeaponSpecialTrait>
}

export default class Weapon {

	readonly id = uuid()

	static build(weaponStruct: IWeapon) {
		const { name, lock, attack, damage, arc, special } = weaponStruct;
		return new Weapon(name, lock, attack, damage, arc, special);
	}

	constructor(
		readonly name: string,
		readonly lock: Lock,
		readonly attack: Attack,
		readonly damage: Damage,
		readonly arc: Arc,
		readonly special: Array<WeaponSpecialTrait> = []
	){}
}