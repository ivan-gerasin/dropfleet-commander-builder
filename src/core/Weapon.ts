import WeaponSpecialTrait from 'core/WeaponSpecialTrait';

type Lock = number
type Attack = number
type Damage = number
type Arc = string


class Weapon {
	constructor(
		readonly name: string,
		readonly lock: Lock,
		readonly attack: Attack,
		readonly damage: Damage,
		readonly arc: Arc,
		readonly special: Array<WeaponSpecialTrait>
	){}
}