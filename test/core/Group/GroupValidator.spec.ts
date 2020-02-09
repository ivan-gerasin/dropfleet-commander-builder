import Group from 'core/Group/Group'
import GroupValidator from 'core/Group/GroupValidator'
import UnitFactory from '../mocks/units'

describe('GroupValidator', () => {
	const instance = new GroupValidator()

	test('return error if group size is more than unit allow', () => {
		const OVERSIZED_UNIT_SIZE = 3
		const UNIT_1 = UnitFactory({ groupSize: 2 })
		const GROUP_1 = Group.build(UNIT_1, OVERSIZED_UNIT_SIZE)
		const errors = instance.validate(GROUP_1)
		expect(errors).toHaveLength(1)
		expect(errors[0]).toContain(
			`Group of ${UNIT_1.name} have size ${OVERSIZED_UNIT_SIZE} but maximum is ${UNIT_1.groupSize}`
		)
	})

	test('return error if group size is less than 1', () => {
		const UNDERSIZED_UNIT_SIZE = 0
		const MIN = 1
		const UNIT_1 = UnitFactory({ groupSize: 2 })
		const GROUP_1 = Group.build(UNIT_1, UNDERSIZED_UNIT_SIZE)
		const errors = instance.validate(GROUP_1)
		expect(errors[0]).toContain(`Group of ${UNIT_1.name} have size ${UNDERSIZED_UNIT_SIZE} but minimum is ${MIN}`)
	})
})
