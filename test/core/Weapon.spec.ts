import Arc from 'core/Arc'
import Weapon from 'core/Weapon'

describe('Weapon', () => {
	const name = 'big gun'
	const lock = 4
	const attack = 2
	const damage = 1
	const arc = Arc.Front

	test('weapon constructed', () => {
		const instance = new Weapon(name, lock, attack, damage, arc)
		expect(instance.id !== undefined)
		expect(instance.id !== null)
		expect(typeof instance.id === 'string')
		expect(instance.name == name)
		expect(instance.lock == lock)
		expect(instance.attack == attack)
		expect(instance.damage == damage)
		expect(instance.arc == Arc.Front)
	})
})
