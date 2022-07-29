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

		this.#mapping = {
			...reverseMapping,
			...mapping,
		}
		this.#reverseMapping = {
			...mapping,
			...reverseMapping,
		}

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
			if (!(ch in this.#mapping)) {
				throw new Error(`Failed to get character mapping for [${ch}], codepoint: ${ch.codePointAt(0)}`)
			}

			yield this.#mapping[ch]
		}
	}
}
