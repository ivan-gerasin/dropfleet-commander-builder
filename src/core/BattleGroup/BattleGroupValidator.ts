import BattleGroup from 'core/BattleGroup/BattleGroup';
import BattleGroupType from 'core/BattleGroupType';
import {ErrorOrNull, IClassValidator, ValidationError} from 'core/CommonInterfaces';
import Group from 'core/Group';
import GroupSizing from 'core/Sizing';
import TonnageClass from 'core/TonnageClass';
import {TonnageSizingExtrator} from 'core/TonnageRestrictionsExtractor';
import {compact, difference, flatten, zip} from 'lodash';

type TonnageSizingItem = [TonnageClass, GroupSizing]
type TonnageNumbersItem = [TonnageClass, number]
export default class BattleGroupValidator implements IClassValidator<BattleGroup>{

	validate(battleGroup: BattleGroup): Array<ValidationError> {
		return compact(flatten([
			this.validateTonnageMinMaxRestrictions(battleGroup),
			this.validateTonnageTypes(battleGroup),
			this.validateMaximumGroupsNumber(battleGroup)
		]))
	}

	private validateMaximumGroupsNumber(that: BattleGroup): ErrorOrNull {
		if (that.groups.length > that.groupType.max) {
			return `${that.groupType.type} battle group maximum size is ${that.groupType.max}`
		}
		return null
	}

	private validateTonnageTypes(that: BattleGroup): Array<ValidationError> {
		const groupType = that.groupType.type
		const allowedTonnage: Array<TonnageClass> = that.tonnageRestrictionsExtractor.getAllowedTonnageClass(groupType)
		const existingTonnage: Array<TonnageClass> = that.groups.map((group) => group.unit.tonnage)
		const forbiddenTonnage = difference(existingTonnage, allowedTonnage)
		return forbiddenTonnage.map((tonnage) =>
			`${tonnage} tonnage class is forbidden in ${groupType} battle group type`
		)
	}

	private validateTonnageMinMaxRestrictions(that: BattleGroup): Array<ValidationError> {
		const groupType = that.groupType.type
		const extractor = that.tonnageRestrictionsExtractor
		const allowedTonnage: Array<TonnageClass> = extractor.getAllowedTonnageClass(groupType)

		const tonnageSizingMapping: Array<TonnageSizingItem> =
			this.getTonnageSizingMapping(allowedTonnage, groupType, extractor.getTonnageSizingForBattleGroup)


		const groupsWithTonnageNumbers: Array<TonnageNumbersItem> =
			this.getTonnageGroupNumbers(allowedTonnage, that.getGroupsWithTonnage)

		const filterByTonnageViolation = this.createFilterByTonnageViolation(groupsWithTonnageNumbers)
		const filterMoreThanMax = this.createFilterByMoreThanMaxGroups(groupsWithTonnageNumbers)
		const filterLessThanMin = this.createFilterByLessThatMinGroups(groupsWithTonnageNumbers)


		const groupsWithSizeViolation: Array<TonnageSizingItem> =
			tonnageSizingMapping.filter(filterByTonnageViolation);

		const overMax =
			groupsWithSizeViolation
				.filter(filterMoreThanMax)
				.map(this.moreThanMaxTonnageError(groupsWithTonnageNumbers));

		const lessMin =
			groupsWithSizeViolation
				.filter(filterLessThanMin)
				.map(this.lessThanMinTonnageError(groupsWithTonnageNumbers));

		return compact(overMax.concat(lessMin));

	}

	private getTonnageSizingMapping(allowedTonnage: Array<TonnageClass>,
	                        groupType: BattleGroupType,
	                        extractor: TonnageSizingExtrator): Array<TonnageSizingItem> {
		return zip(
			allowedTonnage,
			allowedTonnage.map((tonnage: TonnageClass) => extractor(groupType, tonnage))
		) as Array<TonnageSizingItem>;
	}

	private getTonnageGroupNumbers(allowedTonnage: Array<TonnageClass>,
	                       extractor: (tonnage: TonnageClass) => Array<Group>): Array<TonnageNumbersItem> {
		return zip(
			allowedTonnage,
			allowedTonnage.map((tonnage) => extractor(tonnage).length)
		) as Array<TonnageNumbersItem>;
	}

	private getNumberOfTonnage(tonnage: TonnageClass, groupsWithTonnageNumbers: Array<TonnageNumbersItem>): number {
		const TONNAGE = 0;
		const NUMBER = 1;
		const item = groupsWithTonnageNumbers.find((item: TonnageNumbersItem) => item[TONNAGE] === tonnage )
		if (item) {
			return item[NUMBER];
		}
		return 0;		
	}

	private createFilterByTonnageViolation(groupsWithTonnageNumbers: Array<TonnageNumbersItem>) {
		return (item: TonnageSizingItem): boolean => {
			const [tonnage, sizing] = item;
			const groupsWithTonnage = this.getNumberOfTonnage(tonnage, groupsWithTonnageNumbers);
			return (groupsWithTonnage > sizing.max) || (groupsWithTonnage < sizing.min)
		};
	}
	
	private createFilterByMoreThanMaxGroups(groupsWithTonnageNumbers: Array<TonnageNumbersItem>) {
		return (item: TonnageSizingItem): boolean => {
			const [tonnage, sizing] = item;
			const groupsWithTonnage = this.getNumberOfTonnage(tonnage, groupsWithTonnageNumbers);
			return groupsWithTonnage > sizing.max
		};
	}
	
	private createFilterByLessThatMinGroups(groupsWithTonnageNumbers: Array<TonnageNumbersItem>) {
		return (item: TonnageSizingItem): boolean => {
			const [tonnage, sizing] = item;
			const groupsWithTonnage = this.getNumberOfTonnage(tonnage, groupsWithTonnageNumbers);
			return groupsWithTonnage < sizing.min
		};
	}
	
	private moreThanMaxTonnageError(groupsWithTonnageNumbers: Array<TonnageNumbersItem>) {
		return (item: TonnageSizingItem): string => {
			const [tonnage, sizing] = item;
			const groupsWithTonnage = this.getNumberOfTonnage(tonnage, groupsWithTonnageNumbers);
			return `There is ${groupsWithTonnage} of ${tonnage} group(s), but only ${sizing.max} allowed`
		}
	}

	private lessThanMinTonnageError(groupsWithTonnageNumbers: Array<TonnageNumbersItem>) {
		return (item: TonnageSizingItem): string => {
			const [tonnage, sizing] = item;
			const groupsWithTonnage = this.getNumberOfTonnage(tonnage, groupsWithTonnageNumbers);
			return `There is ${groupsWithTonnage} of ${tonnage} group(s), but at least ${sizing.min} required`
		}
	}

}