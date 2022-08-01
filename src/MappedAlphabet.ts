import { Alphabet } from './common'

export interface MappedAlphabetParams {
	base: Alphabet
	// Keys are base characters
	mapping: Record<string, string>
}

export class MappedAlphabet implements Alphabet {
	readonly #base: Alphabet
	// Keys are base characters
	readonly #mapping: Record<string, string>
	// Keys are output characters
	readonly #reverseMapping: Record<string, string>

	public constructor({
		base,
		mapping,
	}: MappedAlphabetParams) {
		this.#base = base

		const reverseMapping = Object.fromEntries(
			Object.entries(mapping)
				.map(([baseChar, outputChar]) => [outputChar, baseChar])
		)

		this.#mapping = mapping
		this.#reverseMapping = reverseMapping

		if (Object.keys(this.#mapping).length !== Object.keys(this.#reverseMapping).length) {
			throw new Error('Mapped keys must have 1-1 correspondence')
		}
	}

	public get length(): number {
		return this.#base.length
	}

	public has(char: string): boolean {
		return char in this.#reverseMapping
			? this.#base.has(this.#reverseMapping[char])
			: this.#base.has(char)

	}

	public getAt(index: number): string {
		const baseChar = this.#base.getAt(index)
		return baseChar in this.#mapping
			? this.#mapping[baseChar]
			: baseChar
	}

	public indexOf(char: string): number {
		return this.#base.indexOf(
			char in this.#reverseMapping
				? this.#reverseMapping[char]
				: char
		)
	}

	public *[Symbol.iterator]() {
		for (const ch of this.#base) {

			yield ch in this.#mapping
				? this.#mapping[ch]
				: ch
		}
	}
}
