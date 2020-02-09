import { compact } from 'lodash'
import Group from 'core/Group/Group'
import { IClassValidator, ValidationError } from 'core/CommonInterfaces'

export default class GroupValidator implements IClassValidator<Group> {
	validate(that: Group): Array<ValidationError> {
		return compact(this.validateGroupSize(that))
	}

	private validateGroupSize(that: Group): Array<ValidationError> {
		const maxSize = that.unit.groupSize
		const currentSize = that.size
		const minSize = 1

		return [
			currentSize > maxSize
				? `Group of ${that.unit.name} have size ${currentSize} but maximum is ${maxSize}`
				: '',
			currentSize < minSize ? `Group of ${that.unit.name} have size ${currentSize} but minimum is ${minSize}` : ''
		]
	}
}
