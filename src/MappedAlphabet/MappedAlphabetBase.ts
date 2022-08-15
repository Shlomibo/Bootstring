import { Alphabet } from '../common'

export interface MappedAlphabetParams {
	base: Alphabet
	// Keys are base characters
	mapping: Record<string, string>
}

export abstract class MappedAlphabetBase implements Alphabet {
	protected readonly _base: Alphabet
	// Keys are base characters
	protected readonly _mapping: Record<string, string>
	// Keys are output characters
	protected readonly _reverseMapping: Record<string, string>

	public constructor({
		base,
		mapping,
	}: MappedAlphabetParams) {
		this._base = base

		const reverseMapping = Object.fromEntries(
			Object.entries(mapping)
				.map(([baseChar, outputChar]) => [outputChar, baseChar])
		)

		this._mapping = mapping
		this._reverseMapping = reverseMapping

		if (Object.keys(this._mapping).length !== Object.keys(this._reverseMapping).length) {
			throw new Error('Mapped keys must have 1-1 correspondence')
		}
	}

	public get length(): number {
		return this._base.length
	}

	public abstract has(char: string): boolean

	public abstract getAt(index: number): string

	public abstract indexOf(char: string): number

	public abstract [Symbol.iterator](): Generator<string, void, unknown>
}
