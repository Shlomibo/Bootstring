import { Alphabet } from './common'

export interface UnicodeSubsetAlphabetParams {
	start?: number | string
	end?: number | string
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
		if (typeof start === 'number') {
			this.#start = start
		}
		else if (start.length === 0) {
			throw new Error('Invalid start string')
		}
		else {
			this.#start = start.codePointAt(0)!
		}

		if (typeof end === 'number') {
			this.#end = end
		}
		else if (end.length === 0) {
			throw new Error('Invalid end string')
		}
		else {
			this.#end = end.codePointAt(0)!
		}

		let length = this.#end - this.#start + 1 - diffFromCodepoint(
			this.#end - this.#start,
			this.#start
		)

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

		const result = zeroIndex - this.#start
		return result < 0 || result > this.#end
			? -1
			: result
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

	public has(char: string): boolean {
		const codepoint = char.codePointAt(0)!
		const index = codepoint - diffFromCodepoint(codepoint, this.#start)

		return index >= this.#start &&
			index <= this.#end
	}
}

function diffFromCodepoint(index: number, start: number): number {
	const offsetIndex = index + start

	return offsetIndex < UTF16_SURROGATES_START
		? 0
		: Math.min(offsetIndex, UTF16_SURROGATES_END + 1) - UTF16_SURROGATES_START
}
