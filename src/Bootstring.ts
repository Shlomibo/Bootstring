import { Alphabet, NthBase } from './common'
import { BootstringParams as AlgorithmParams, CodepointsString, decode, encode, validateParams } from './Algorithms'

export interface BootstringParams {
	basicAlphabet: Alphabet
	extendedAlphabet: Alphabet
	base: NthBase
	delimiter: string
	tMin: number
	tMax: number
	skew: number
	damp: number
	initialBias: number
	initialN?: number
}

export class Bootstring {
	readonly #algorithmParams: AlgorithmParams
	readonly #base: NthBase
	readonly #basicAlphabet: Alphabet
	readonly #extendedAlphabet: Alphabet

	public constructor({
		base,
		basicAlphabet,
		extendedAlphabet,
		tMin,
		tMax,
		initialN,
		delimiter,
		...algorithmParams
	}: BootstringParams) {
		this.#base = base
		this.#basicAlphabet = basicAlphabet
		this.#extendedAlphabet = extendedAlphabet

		this.#algorithmParams = {
			base: base.base,
			baseAlphabetSize: basicAlphabet.length,
			tmin: tMin,
			tmax: tMax,
			initialN: initialN ?? this.#basicAlphabet.length + 1,
			delimiter: basicAlphabet.indexOf(delimiter),
			...algorithmParams
		}

		validateParams(this.#algorithmParams)
	}

	public encode(string: string): string {
		const codepoints = this.#codepointsString(string)

		const encodedCodepoints = encode({
			string: codepoints,
			getCodepoint: this.#getCodepoint,
			...this.#algorithmParams,
		})

		return this.#parseCodepointsString(encodedCodepoints)
	}

	public decode(string: string): string {
		const codepoints = this.#codepointsString(string)

		const encodedCodepoints = decode({
			string: codepoints,
			getDigit: this.#getDigit,
			...this.#algorithmParams,
		})

		return this.#parseCodepointsString(encodedCodepoints)
	}

	readonly #getCodepoint = (digit: number): number => {
		if (
			!Number.isInteger(digit) ||
			digit < 0 ||
			digit > this.#base.base
		) {
			throw new Error('Invalid digit')
		}

		return this.#base.digits[digit].codePointAt(0)!
	}

	readonly #getDigit = (codepoint: number): number => {
		const ch = String.fromCodePoint(codepoint)

		if (!(ch in this.#base.values)) {
			throw new Error(`Invalid digit [${ch}] codepoint: ${codepoint}`)
		}

		return this.#base.values[ch]
	}

	#codepointsString(string: string): CodepointsString {
		return Array.from((function* (): Iterable<number> {
			for (const ch of string) {
				yield ch.codePointAt(0)!
			}
		})())
	}

	#parseCodepointsString(string: CodepointsString): string {
		return string
			.map(codepoint => String.fromCodePoint(codepoint))
			.join('')
	}
}
