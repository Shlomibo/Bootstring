import { adaptBias } from './BiasAdaptation'
import { BootstringParams, CodepointsString } from './common'

export interface EncodeParams extends BootstringParams {
	string: CodepointsString
}

export function encode({
	string,

	...bootstringParams
}: EncodeParams): CodepointsString {
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

	// let delta = 0
	let delta = 0

	// let bias = initial_bias
	let bias = initialBias

	/* let h = b = the number of basic code points in the input
	 * copy them to the output in order, followed by a delimiter if b > 0
	 * {if the input contains a non-basic code point < n then fail} */
	let h = 0
	let output: CodepointsString = []

	for (const { ch, i } of string.map((ch, i) => ({ ch, i }))) {
		if (ch < baseAlphabetSize) {
			h++
			output.push(ch)
		}
		else if (ch < n) {
			throw new Error(`Invalid character endpoint ${ch} at index ${i}.`)
		}
	}

	let b = h

	if (h > 0) {
		output.push(delimiter)
	}

	// while h < length(input) do begin
	while (h < string.length) {
		// let m = the minimum {non-basic} code point >= n in the input
		let m = string.reduce(
			(m, ch) => m = ch >= n && ch < m
				? ch
				: m,
			Infinity
		)

		m = m === Infinity
			? n
			: m


		// let delta = delta + (m - n) * (h + 1), fail on overflow
		delta += (m - n) * (h + 1)

		if (!Number.isSafeInteger(delta)) {
			throw new Error('Overflow')
		}

		// let n = m
		n = m

		// for each code point c in the input (in order) do begin
		for (const c of string) {
			// if c < n {or c is basic} then increment delta, fail on overflow
			if (c < n) {
				delta++

				if (!Number.isSafeInteger(delta)) {
					throw new Error('Overflow')
				}
			}
			// if c == n then begin
			else if (c === n) {
				// let q = delta
				let q = delta

				// for k = base to infinity in steps of base do begin
				for (let k = base; true; k += base) {
					/* let t = tmin if k <= bias {+ tmin}, or
					 * 	 tmax if k >= bias + tmax, or k - bias otherwise */
					let t =
						k <= bias + tmin ? tmin :
							k >= bias + tmax ? tmax :
								k - bias

					// if q < t then break
					if (q < t) {
						break
					}

					// output the code point for digit t + ((q - t) mod (base - t))
					output.push(t + ((q - t) % (base - t)))

					// let q = (q - t) div (base - t)
					q = Math.floor((q - t) / (base - t))

					// end
				}

				// output the code point for digit q
				output.push(q)

				// let bias = adapt(delta, h + 1, test h equals b?)
				bias = adaptBias({
					delta,
					processedCodePointsCount: h + 1,
					isFirstTime: h === b,
					...bootstringParams,
				})

				// let delta = 0
				delta = 0

				// increment h
				h++

				// end
			}

			// end
		}

		// increment delta and n
		delta++
		n++

		// end
	}

	return output
}
