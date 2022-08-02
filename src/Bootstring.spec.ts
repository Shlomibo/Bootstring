import { expect } from 'chai'
import { Bootstring } from './Bootstring'
import { SimpleNthBase } from './common'
import { MappedAlphabet } from './MappedAlphabet'
import { Test } from './Punycode.spec'
import { UnicodeSubsetAlphabet } from './UnicodeSubsetAlphabet'

const delimiter = 'X'
// Capitals + lowercase + numerals
const alphaNumericValidCharsCount = (26 * 2) + 10
// Maps the lower ascii to alphanumeric
const baseCharacterMapping: Record<string, string> = Object.fromEntries({
	*[Symbol.iterator]() {
		let i = 0

		for (; i < 10; i++) {
			yield [
				String.fromCodePoint(i),
				String.fromCodePoint(i + '0'.codePointAt(0)!)
			]
		}

		for (; i < 10 + 26; i++) {
			yield [
				String.fromCodePoint(i),
				String.fromCodePoint(i + - 10 + 'A'.codePointAt(0)!)
			]
		}

		for (; i < 10 + (26 * 2); i++) {
			yield [
				String.fromCodePoint(i),
				String.fromCodePoint(i + - 36 + 'a'.codePointAt(0)!)
			]
		}
	}
})

// As before, but also maps lower and upper case letters back to lower ascii (so all
// characters having representation)
const fullCharacterMapping: Record<string, string> = {
	...baseCharacterMapping,
	...Object.fromEntries({
		*[Symbol.iterator]() {
			// Remap uppercase
			for (let i = 0; i < 26; i++) {
				yield [
					String.fromCodePoint(i + 'A'.codePointAt(0)!),
					String.fromCodePoint(i),
				]
			}

			// Remap lowercase
			for (let i = 0; i < 26; i++) {
				const targetStart = 26
				const targetSkipAt = '0'.codePointAt(0)!

				const target = i + targetStart

				yield [
					String.fromCodePoint(i + 'a'.codePointAt(0)!),
					String.fromCodePoint(
						target < targetSkipAt
							? target
							: target + 10
					),
				]
			}
		}
	})
}

const alphaNumericAlphabet = new MappedAlphabet({
	base: new UnicodeSubsetAlphabet({ end: alphaNumericValidCharsCount - 1 }),
	mapping: baseCharacterMapping,
})
const remappedUnicode = new MappedAlphabet({
	base: UnicodeSubsetAlphabet.unicode,
	mapping: fullCharacterMapping,
})

const tests: Test[] = [{
	decoded: 'LogicalId01',
	encoded: 'LogicalId01X',
	normalized: 'LogicalId01X',
}, {
	decoded: 'Some string with CapiTalS, spaces, punctuation_and-stuff 😳',
	encoded: 'SomestringwithCapiTalSspacespunctuationandstuffX3RrG6486KhV70t1ayyqZ',
	normalized: 'SomestringwithCapiTalSspacespunctuationandstuffX3RrG6486KhV70t1ayyqZ',
}, {
	decoded: JSON.stringify({ stringified: 'JS object' }, null, '\t'),
	encoded: 'stringifiedJSobjectXz3KKlV2aB19rIs1v1',
	normalized: 'stringifiedJSobjectXz3KKlV2aB19rIs1v1',
}, {
	decoded: 'אפילו עברית!',
	encoded: 'g02lk950IN3Kv0Fp0P',
	normalized: 'g02lk950IN3Kv0Fp0P',
}, {
	decoded: '\u0644\u064A\u0647\u0645\u0627\u0628\u062A\u0643\u0644\u0645\u0648\u0634' +
		'\u0639\u0631\u0628\u064A\u061F',
	encoded: '5PF309h0Kfj26475LMND',
	normalized: '5PF309h0Kfj26475LMND',
}, {
	decoded: '\u4ED6\u4EEC\u4E3A\u4EC0\u4E48\u4E0D\u8BF4\u4E2D\u6587',
	encoded: 'ylFS1c0v0nJK2Z3yvu0VJQ',
	normalized: 'ylFS1c0v0nJK2Z3yvu0VJQ',
}, {
	decoded: '\u4ED6\u5011\u7232\u4EC0\u9EBD\u4E0D\u8AAA\u4E2D\u6587',
	encoded: 'ylFS1VCZ1aj0NuRHt6EJGohD',
	normalized: 'ylFS1VCZ1aj0NuRHt6EJGohD',
}, {
	decoded: `Pro\u010Dprost\u011Bnemluv\u00ED\u010Desky`,
	encoded: 'ProprostnemluveskyXeu0xUC0sD',
	normalized: 'ProprostnemluveskyXeu0xUC0sD',
}, {
	decoded: 'למההםפשוטלאמדבריםעברית',
	encoded: 'lN206307OC1N4A747s1Qk248b',
	normalized: 'lN206307OC1N4A747s1Qk248b',
}, {
	decoded: 'למה הם פשוט לא מדברים עברית',
	encoded: 'g00000iuK801F41DeJ2Y7DA5Bu2Y0n35Aj0',
	normalized: 'g00000iuK801F41DeJ2Y7DA5Bu2Y0n35Aj0',
}, {
	decoded: '\u092F\u0939\u0932\u094B\u0917\u0939\u093F\u0928\u094D\u0926\u0940\u0915' +
		'\u094D\u092F\u094B\u0902\u0928\u0939\u0940\u0902\u092C\u094B\u0932\u0938\u0915' +
		'\u0924\u0947\u0939\u0948\u0902',
	encoded: 'Oc00t128w2BH3k0S4c9x25266u3O5z6Q0w086l03',
	normalized: 'Oc00t128w2BH3k0S4c9x25266u3O5z6Q0w086l03',
}, {
	decoded: '\u306A\u305C\u307F\u3093\u306A\u65E5\u672C\u8A9E\u3092\u8A71\u3057\u3066\u304F' +
		'\u308C\u306A\u3044\u306E\u304B',
	encoded: 'tr8EAVOh1P13gn6V3W1CkxqRCR1Epw1SD0',
	normalized: 'tr8EAVOh1P13gn6V3W1CkxqRCR1Epw1SD0',
}, {
	decoded: '\uC138\uACC4\uC758\uBAA8\uB4E0\uC0AC\uB78C\uB4E4\uC774\uD55C\uAD6D\uC5B4\uB97C' +
		'\uC774\uD574\uD55C\uB2E4\uBA74\uC5BC\uB9C8\uB098\uC88B\uC744\uAE4C',
	encoded: '6rbG7YCugyn0lp0S0ivCQf1gCLZcAgmHbW0yoDB2bv6l5cA3pyDrlZ40iS',
	normalized: '6rbG7YCugyn0lp0S0ivCQf1gCLZcAgmHbW0yoDB2bv6l5cA3pyDrlZ40iS',
}, {
	decoded: '\u043F\u043E\u0447\u0435\u043C\u0443\u0436\u0435\u043E\u043D\u0438\u043D\u0435' +
		'\u0433\u043E\u0432\u043E\u0440\u044F\u0442\u043F\u043E\u0440\u0443\u0441\u0441\u043A\u0438',
	encoded: 'rG15004F3HDD1645103EJ2M0JCGp2g6',
	normalized: 'rG15004F3HDD1645103EJ2M0JCGp2g6',
}, {
	decoded: 'Porqu\u00E9nopuedensimplementehablarenEspa\u00F1ol',
	encoded: 'PorqunopuedensimplementehablarenEspaolXEt3mG',
	normalized: 'PorqunopuedensimplementehablarenEspaolXEt3mG',
}, {
	decoded: 'T\u1EA1isaoh\u1ECDkh\u00F4ngth\u1EC3ch\u1EC9n\u00F3iti\u1EBFngVi\u1EC7t',
	encoded: 'TisaohkhngthchnitingVitXes1HmwpQoD0n1x2o0j3',
	normalized: 'TisaohkhngthchnitingVitXes1HmwpQoD0n1x2o0j3',
}, {
	decoded: '3\u5E74B\u7D44\u91D1\u516B\u5148\u751F',
	encoded: '3BXKor0m2qtILgBCR4SiE',
	normalized: '3BXKor0m2qtILgBCR4SiE',
}, {
	decoded: '\u5B89\u5BA4\u5948\u7F8E\u6075-with-SUPER-MONKEYS',
	encoded: 'withSUPERMONKEYSXIF45hqzj1vL3t9ApPNCh1',
	normalized: 'withSUPERMONKEYSXIF45hqzj1vL3t9ApPNCh1',
}, {
	decoded: `Hello-Another-Way-\u305D\u308C\u305E\u308C\u306E\u5834\u6240`,
	encoded: 'HelloAnotherWayXTE73wktVK0qFxC1pskYfqH',
	normalized: 'HelloAnotherWayXTE73wktVK0qFxC1pskYfqH',
}, {
	decoded: `\u3072\u3068\u3064\u5C4B\u6839\u306E\u4E0B2`,
	encoded: '2XroJBPHusm4ZY7Ci7',
	normalized: '2XroJBPHusm4ZY7Ci7',
}, {
	decoded: `Maji\u3067Koi\u3059\u308B5\u79D2\u524D`,
	encoded: 'MajiKoi5XMhw2b2f9Mwm3zkc',
	normalized: 'MajiKoi5XMhw2b2f9Mwm3zkc',
}, {
	decoded: '\u30D1\u30D5\u30A3\u30FCde\u30EB\u30F3\u30D0',
	encoded: 'deXRoUQ41Oi6M1n1',
	normalized: 'deXRoUQ41Oi6M1n1',
}, {
	decoded: `\u305D\u306E\u30B9\u30D4\u30FC\u30C9\u3067`,
	encoded: 'Js8KKsDU1V1f8',
	normalized: 'Js8KKsDU1V1f8',
}, {
	decoded: '-> $1.00 <-',
	encoded: '100X0s83Op176m0',
	normalized: '100X0s83Op176m0',
}]

describe('Given an encoder to strict alpha-numeric', () => {
	// Our base use all the character but the delimiter (as it is forbidden for it being used
	// as a digit)
	// That is Base-61!
	const alphaNumericEncoder = new Bootstring({
		base: new SimpleNthBase([...alphaNumericAlphabet]
			.filter(ch => !ch.includes(delimiter))
			.map(ch => [ch])),
		basicAlphabet: alphaNumericAlphabet,
		extendedAlphabet: remappedUnicode,
		delimiter,
		tMin: 1,
		// NAILED IT
		tMax: 42,
		skew: 38,
		damp: 700,
		initialBias: 72,
	})

	describe('It successfully encode various strings', () => {
		for (const { i, test: { decoded, normalized } } of tests.map((test, i) => ({ test, i }))) {
			describe(`And a text with just ascii [${i}] (${decoded})`, () => {
				it('Successfully encode strings', () => {
					const encoded = alphaNumericEncoder.encode(decoded)
					expect(encoded).to.equal(normalized)
				})
			})
		}
	})

	describe('It successfully decode various strings', () => {
		for (const { i, test: { decoded, encoded } } of tests.map((test, i) => ({ test, i }))) {
			describe(`And a text with just ascii [${i}] (${decoded})`, () => {
				it('Successfully decode strings', () => {
					const tested = alphaNumericEncoder.decode(encoded)
					expect(tested).to.equal(decoded)
				})
			})
		}
	})
})
