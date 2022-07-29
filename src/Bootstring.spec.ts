import { expect } from 'chai'
import { Bootstring } from './Bootstring'
import { SimpleNthBase } from './common'
import { MappedAlphabet } from './MappedAlphabet'
import { Test } from './Punycode.spec'
import { UnicodeSubsetAlphabet } from './UnicodeSubsetAlphabet'

const delimiter = 'X'
const logicalIdValidCharsCount = (26 * 2) + 10
const charactersMapping: Record<string, string> = Object.fromEntries(
	Array.from({ length: logicalIdValidCharsCount }, (_, i) => {
		const base: number =
			i < 10 ? '0'.codePointAt(0)! :
				i < 36 ? 'A'.codePointAt(0)! - 10 :
					'a'.codePointAt(0)! - 36

		return [
			String.fromCodePoint(i),
			String.fromCodePoint(i + base)
		]
	})
)

const logicalIdAlphabet = new MappedAlphabet({
	base: new UnicodeSubsetAlphabet({ end: logicalIdValidCharsCount - 1 }),
	mapping: charactersMapping,
})
const remappedUnicode = new MappedAlphabet({
	base: UnicodeSubsetAlphabet.unicode,
	mapping: charactersMapping,
})

const tests: Test[] = [{
	decoded: 'LogicalId01',
	encoded: 'LogicalId01X',
	normalized: 'LogicalId01X',
}, {
	decoded: 'Some string with CpiTalS, spaces, punctuation_and-stuff',
	encoded: 'SomestringwithCpiTalSspacespunctuationandstuffXeJ6476hBq97b1',
	normalized: 'SomestringwithCpiTalSspacespunctuationandstuffXeJ6476hBq97b1',
}, {
	decoded: JSON.stringify({ stringified: 'JS object' }),
	encoded: 'stringifiedJSobjectXY8S0B09eKa1j1',
	normalized: 'stringifiedJSobjectXY8S0B09eKa1j1',
}, {
	decoded: 'אפילו עברית!',
	encoded: 'P02Yo250IN3Kv0Fp0P',
	normalized: 'P02Yo250IN3Kv0Fp0P',
}]

describe('...', () => {
	const awsLogicalIDsEncoder = new Bootstring({
		base: new SimpleNthBase([...logicalIdAlphabet]
			.filter(ch => !ch.includes(delimiter))
			.map(ch => [ch])),
		basicAlphabet: logicalIdAlphabet,
		extendedAlphabet: remappedUnicode,
		delimiter,
		tMin: 1,
		tMax: 26,
		skew: 38,
		damp: 700,
		initialBias: 72,
	})

	describe('It successfully encode various strings', () => {
		for (const { i, test: { decoded, normalized } } of tests.map((test, i) => ({ test, i }))) {
			describe(`And a text with just ascii [${i}]`, () => {
				it('Successfully encode strings', () => {
					const encoded = awsLogicalIDsEncoder.encode(decoded)
					expect(encoded).to.equal(normalized)
				})
			})
		}
	})

	describe('It successfully decode various strings', () => {
		for (const { i, test: { decoded, encoded } } of tests.map((test, i) => ({ test, i }))) {
			describe(`And a text with just ascii [${i}]`, () => {
				it('Successfully decode strings', () => {
					const tested = awsLogicalIDsEncoder.decode(encoded)
					expect(tested).to.equal(decoded)
				})
			})
		}
	})
})
