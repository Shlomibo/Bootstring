import { Alphabet } from './common'

export interface UnicodeSubsetAlphabetParams {
	start?: number
	end?: number
}

const UNICODE_MAX = 0x10FFFF
const UTF16_SURROGATES_START = 0xD800
const UTF16_SURROGATES_END = 0xDFFF
const UTF16_SURROGATES_COUNT = UTF16_SURROGATES_END - UTF16_SURROGATES_START + 1

export class UnicodeSubsetAlphabet implements Alphabet {
	static readonly unicode = new UnicodeSubsetAlphabet()
	static readonly ascii = new UnicodeSubsetAlphabet({ end: 127 })

	readonly #start: number
	readonly #end: number

	public readonly length: number

	public constructor({
		start = 0,
		end = UNICODE_MAX,
	}: UnicodeSubsetAlphabetParams = {}) {
		this.#start = start
		this.#end = end

		let length = end - start + 1

		if (start <= UTF16_SURROGATES_START && end >= UTF16_SURROGATES_START) {
			length -= Math.min(end, UTF16_SURROGATES_END) - UTF16_SURROGATES_START
		}

		if (start <= UTF16_SURROGATES_END && end >= UTF16_SURROGATES_END) {
			length -= UTF16_SURROGATES_END - Math.max(start, UTF16_SURROGATES_START)
		}

		this.length = length
	}

	public getAt(index: number): string {
		index += this.#start
		const codepointDelta = index < UTF16_SURROGATES_START
			? 0
			: UTF16_SURROGATES_COUNT

		return String.fromCodePoint(index + codepointDelta)
	}

	public indexOf(char: string): number {
		const codepoint = char.codePointAt(0)!

		const zeroIndex = codepoint > UTF16_SURROGATES_END
			? codepoint - UTF16_SURROGATES_COUNT
			: codepoint

		return zeroIndex - this.#start
	}

	public *[Symbol.iterator]() {
		const underSurrogatesEnd = Math.min(this.#end + 1, UTF16_SURROGATES_START)

		for (let i = Math.min(this.#start, UTF16_SURROGATES_START); i < underSurrogatesEnd; i++) {
			yield String.fromCodePoint(i)
		}

		const aboveSurrogatesStart = Math.max(this.#start, UTF16_SURROGATES_END + 1)

		for (let i = aboveSurrogatesStart; i <= this.#end; i++) {
			yield String.fromCodePoint(i)
		}
	}
}
