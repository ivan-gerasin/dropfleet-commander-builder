export interface IWithID {
	readonly id : string
}

export interface IValidated {
	validate    : () => Array<ValidationErrors>
	isValid     : boolean
}

export interface IClassValidator<T> {
	validate    : (instance: T) => Array<ValidationErrors>
}

export type ValidationErrors = string
export type ErrorOrNull = string | null