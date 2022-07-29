import { adaptBias } from './BiasAdaptation'
import { BootstringParams, CodepointsString } from './common'

export interface DecodeParams extends BootstringParams {
	string: CodepointsString
}

export function decode({
	string,

	...bootstringParams
}: DecodeParams): CodepointsString {
	let {
		initialN,
		initialBias,
		delimiter,
		baseAlphabetSize,
		base,
		tmin,
		tmax,
	} = bootstringParams

	// let n = initial_n
	let n = initialN

	// let i = 0
	let i = 0

	// let bias = initial_bias
	let bias = initialBias

	// let output = an empty string indexed from 0
	let output: CodepointsString = []

	/* consume all code points before the last delimiter (if there is one)
	 * and copy them to output, fail on any non-basic code point */
	const delimiterIndex = string.lastIndexOf(delimiter)

	if (delimiterIndex !== -1) {
		for (const { ch, i } of string.map((ch, i) => ({ ch, i }))) {
			if (i >= delimiterIndex) {
				break
			}

			if (ch >= baseAlphabetSize) {
				throw new Error('Invalid bootstring string. Got an extended character instead of basic one.' +
					`Code point: ${ch}; index ${i}`)
			}

			output.push(ch)
		}
	}

	/* if more than zero code points were consumed then consume one more
	 * (which will be the last delimiter) */
	string = string.slice(delimiterIndex + 1)

	// Reversing input as `pop` is more efficient than `shift`
	string.reverse()

	// while the input is not exhausted do begin
	while (string.length > 0) {
		// let oldi = i
		let oldi = i

		// let w = 1
		let w = 1

		// for k = base to infinity in steps of base do begin
		for (let k = base; true; k += base) {
			// consume a code point, or fail if there was none to consume
			const ch = string.shift()

			if (ch === undefined) {
				throw new Error('Failed to get a character')
			}

			// let digit = the code point's digit-value, fail if it has none
			let digit = ch

			// let i = i + digit * w, fail on overflow
			i += digit * w

			if (!Number.isSafeInteger(i)) {
				throw new Error('Overflow')
			}

			/* let t = tmin if k <= bias {+ tmin}, or
			 * tmax if k >= bias + tmax, or k - bias otherwise */
			let t = k <= bias + tmin ? tmin :
				k >= bias + tmax ? tmax :
					k - bias

			// if digit < t then break
			if (digit < t) {
				break
			}

			// let w = w * (base - t), fail on overflow
			w *= base - t

			if (!Number.isSafeInteger(w)) {
				throw new Error('Overflow')
			}

			// end
		}

		// let bias = adapt(i - oldi, length(output) + 1, test oldi is 0?)
		bias = adaptBias({
			delta: i - oldi,
			processedCodePointsCount: output.length + 1,
			isFirstTime: oldi === 0,
			...bootstringParams
		})

		// let n = n + i div (length(output) + 1), fail on overflow
		n += Math.floor(i / output.length + 1)

		if (!Number.isSafeInteger(n)) {
			throw new Error('Overflow')
		}

		// let i = i mod (length(output) + 1)
		i %= output.length + 1

		// {if n is a basic code point then fail}
		if (n < baseAlphabetSize) {
			throw new Error('Invalid bootstring string. Got a basic character instead of an extended one.' +
				`Code point: ${n}`)
		}

		// insert n into output at position i
		output = [
			...output.slice(0, i),
			n,
			...output.slice(i)
		]

		// increment i
		i++

		// end
	}

	return output
}
