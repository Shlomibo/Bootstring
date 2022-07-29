import { BootstringParams } from './common'

export interface BiasAdaptationParams extends BootstringParams {
	delta: number
	processedCodePointsCount: number
	isFirstTime: boolean
}

export function adaptBias({
	delta,
	processedCodePointsCount,
	isFirstTime,
	damp,
	base,
	tmin,
	tmax,
	skew,
}: BiasAdaptationParams): number {
	/** if firsttime then let delta = delta div damp
	 ** else let delta = delta div 2 */
	delta = Math.round(delta / (isFirstTime
		? damp
		: 2))

	// let delta = delta + (delta div numpoints)
	delta += Math.round(delta / processedCodePointsCount)

	// let k = 0
	let k = 0

	//while delta > ((base - tmin) * tmax) div 2 do begin
	while (delta > ((base - tmin) * tmax) / 2) {
		// let delta = delta div (base - tmin)
		delta = Math.round(delta / (base - tmin))
		// let k = k + base
		k += base
		// end
	}

	// return k + (((base - tmin + 1) * delta) div (delta + skew))
	return k + Math.round(((base - tmin + 1) * delta) / (delta + skew))
}
