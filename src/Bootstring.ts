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
			initialN: initialN ?? this.#basicAlphabet.length,
			delimiter: basicAlphabet.indexOf(delimiter),
			isBasicCharacter: codepoint => codepoint < this.#basicAlphabet.length,
			...algorithmParams
		}

		if (delimiter in base.values) {
			throw new Error('Delimiter must not used as digit')
		}

		if (this.#base.digits.some(digits =>
			digits.some(digit => !this.#basicAlphabet.has(digit))
		)) {
			throw new Error("Base's digits must all be part of base alphabet")
		}

		for (const ch of this.#basicAlphabet) {
			if (!this.#extendedAlphabet.has(ch)) {
				throw new Error("Basic alphabet isn't a subset of extended alphabet")
			}
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

		return this.#basicAlphabet.indexOf(this.#base.digits[digit][0])
	}

	readonly #getDigit = (codepoint: number): number => {
		const ch = this.#basicAlphabet.getAt(codepoint)

		if (!(ch in this.#base.values)) {
			throw new Error(`Invalid digit [${ch}] codepoint: ${codepoint}`)
		}

		return this.#base.values[ch]
	}

	#codepointsString(string: string): CodepointsString {
		const that = this

		return Array.from((function* (): Iterable<number> {
			for (const ch of string) {
				yield that.#basicAlphabet.has(ch)
					? that.#basicAlphabet.indexOf(ch)
					: that.#extendedAlphabet.indexOf(ch)
			}
		})())
	}

	#parseCodepointsString(string: CodepointsString): string {
		return string
			.map(codepoint => codepoint < this.#basicAlphabet.length
				? this.#basicAlphabet.getAt(codepoint)
				: this.#extendedAlphabet.getAt(codepoint))
			.join('')
	}
}
