export interface IWithID {
	readonly id : string
}

export interface IWithHash {
	readonly hash: string
}

export interface IValidated {
	validate    : () => Array<ValidationError>
	isValid     : boolean
}

export interface IClassValidator<T> {
	validate    : (instance: T) => Array<ValidationError>
}

export type ValidationError = string
export type ErrorOrNull = string | null