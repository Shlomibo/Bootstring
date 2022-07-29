import { Bootstring } from './Bootstring'
import { SimpleNthBase } from './common'
import { UnicodeSubsetAlphabet } from './UnicodeSubsetAlphabet'

export const base36 = new SimpleNthBase([
	...{
		*[Symbol.iterator]() {
			for (let letter = 'a'.codePointAt(0)!; letter <= 'z'.codePointAt(0)!; letter++) {
				const char = String.fromCodePoint(letter)

				yield [char, char.toUpperCase()]
			}
		}
	},
	...{
		*[Symbol.iterator]() {
			for (let digit = 0; digit <= 9; digit++) {
				yield [String(digit)]
			}
		}
	},
])

export const punycode = new Bootstring({
	base: base36,
	basicAlphabet: UnicodeSubsetAlphabet.ascii,
	extendedAlphabet: UnicodeSubsetAlphabet.unicode,
	delimiter: '-',
	tMin: 1,
	tMax: 26,
	skew: 38,
	damp: 700,
	initialBias: 72,
})
