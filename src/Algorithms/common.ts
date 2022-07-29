/**
 * In order to reduce complexity, only deal with codepoints (integer)
 */
export type CodepointsString = number[]

export interface BootstringParams {
	base: number
	tmin: number
	tmax: number
	skew: number
	damp: number
	initialBias: number
	initialN: number
	delimiter: number
	baseAlphabetSize: number
}

export function validateParams({
	delimiter,
	base,
	baseAlphabetSize,
	tmin,
	tmax,
	skew,
	damp,
	initialBias,
}: BootstringParams): void {
	// Given a set of basic code points, one needs to be designated as the delimiter.
	if (
		!Number.isInteger(delimiter) ||
		delimiter < 0 ||
		delimiter >= baseAlphabetSize
	) {
		throw new Error(`Invalid delimiter.
Must be an integer greater than 0 and below the base characters limit.`)
	}

	// The base cannot be greater than the number of distinguishable basic code points remaining.
	if (
		!Number.isInteger(base) ||
		base <= 1 ||
		base > baseAlphabetSize - 1
	) {
		throw new Error(`Invalid base.
Must be an integer greater than 1 and smaller than base alphabet (without the delimiter) size`)
	}

	if (
		!Number.isInteger(tmin) ||
		tmin < 0 ||
		tmin > tmax
	) {
		throw new Error(`Invalid tmin.
Must be an integer, which cannot be negative nor greater than tmax`)
	}

	if (
		!Number.isInteger(tmax) ||
		tmax > base - 1
	) {
		throw new Error(`Invalid tmax.
Must be an integer and not greater than (base - 1).`)
	}

	if (
		!Number.isInteger(skew) ||
		skew < 1
	) {
		throw new Error(`Invalid skew.
Must be an integer greater than 0.`)
	}

	if (
		!Number.isInteger(damp) ||
		skew < 2
	) {
		throw new Error(`Invalid damp.
Must be an integer greater than 1.`)
	}

	if (
		!Number.isInteger(initialBias) ||
		initialBias % base > base - tmin
	) {
		throw new Error(`Invalid initialBias.
Must be an integer and satisfy (initialBias % base <= base - tmin)`)
	}
}
