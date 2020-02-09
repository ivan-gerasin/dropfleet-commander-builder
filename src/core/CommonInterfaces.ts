export interface IWithID {
	readonly id : string
}

export interface IWithHash<T> {
	readonly hash: string
	isEq: (item: T) => boolean
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
export type Nullable<T> = T | null