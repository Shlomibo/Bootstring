import { expect } from 'chai'
import { punycode } from './Punycode'

interface Test {
	decoded: string
	encoded: string
}

const examples: Record<string, Test> = {
	'Arabic (Egyptian)': {
		decoded: '\u0644\u064A\u0647\u0645\u0627\u0628\u062A\u0643\u0644\u0645\u0648\u0634' +
			'\u0639\u0631\u0628\u064A\u061F',
		encoded: 'egbpdaj6bu4bxfgehfvwxn',
	},
	'Chinese (simplified)': {
		decoded: '\u4ED6\u4EEC\u4E3A\u4EC0\u4E48\u4E0D\u8BF4\u4E2D\u6587',
		encoded: 'ihqwcrb4cv8a8dqg056pqjye',
	},
	'Chinese (traditional)': {
		decoded: '\u4ED6\u5011\u7232\u4EC0\u9EBD\u4E0D\u8AAA\u4E2D\u6587',
		encoded: 'ihqwctvzc91f659drss3x8bo0yb',
	},
	'Czech': {
		decoded: `Pro\u010Dprost\u011Bnemluv\u00ED\u010Desky`,
		encoded: 'Proprostnemluvesky-uyb24dma41a',
	},
	'Hebrew': {
		decoded: 'למההםפשוטלאמדבריםעברית',
		encoded: '4dbcagdahymbxekheh6e0a7fei0b'
	},
	'Hindi (Devanagari)': {
		decoded: '\u092F\u0939\u0932\u094B\u0917\u0939\u093F\u0928\u094D\u0926\u0940\u0915' +
			'\u094D\u092F\u094B\u0902\u0928\u0939\u0940\u0902\u092C\u094B\u0932\u0938\u0915' +
			'\u0924\u0947\u0939\u0948\u0902',
		encoded: 'i1baa7eci9glrd9b2ae1bj0hfcgg6iyaf8o0a1dig0cd'
	},
	'Japanese (kanji and hiragana)': {
		decoded: '\u306A\u305C\u307F\u3093\u306A\u65E5\u672C\u8A9E\u3092\u8A71\u3057\u3066\u304F' +
			'\u308C\u306A\u3044\u306E\u304B',
		encoded: 'n8jok5ay5dzabd5bym9f0cm5685rrjetr6pdxa',
	},
	'Korean (Hangul syllables)': {
		decoded: '\uC138\uACC4\uC758\uBAA8\uB4E0\uC0AC\uB78C\uB4E4\uC774\uD55C\uAD6D\uC5B4\uB97C' +
			'\uC774\uD574\uD55C\uB2E4\uBA74\uC5BC\uB9C8\uB098\uC88B\uC744\uAE4C',
		encoded: '989aomsvi5e83db1d2a355cv1e0vak1dwrv93d5xbh15a0dt30a5jpsd879ccm6fea98c',
	},
	'Russian (Cyrillic)': {
		decoded: '\u043F\u043E\u0447\u0435\u043C\u0443\u0436\u0435\u043E\u043D\u0438\u043D\u0435' +
			'\u0433\u043E\u0432\u043E\u0440\u044F\u0442\u043F\u043E\u0440\u0443\u0441\u0441\u043A\u0438',
		encoded: 'b1abfaaepdrnnbgefbaDotcwatmq2g4l',
	},
	Spanish: {
		decoded: 'Porqu\u00E9nopuedensimplementehablarenEspa\u00F1ol',
		encoded: 'PorqunopuedensimplementehablarenEspaol-fmd56a',
	},
	Vietnamese: {
		decoded: 'T\u1EA1isaoh\u1ECDkh\u00F4ngth\u1EC3ch\u1EC9n\u00F3iti\u1EBFngVi\u1EC7t',
		encoded: 'TisaohkhngthchnitingVit-kjcr8268qyxafd2f1b9g',
	},
}

const japaneseExamples: Test[] = [{
	decoded: '3\u5E74B\u7D44\u91D1\u516B\u5148\u751F',
	encoded: '3B-ww4c5e180e575a65lsy2b',
}, {
	decoded: '\u5B89\u5BA4\u5948\u7F8E\u6075-with-SUPER-MONKEYS',
	encoded: '-with-SUPER-MONKEYS-pc58ag80a8qai00g7n9n',
}, {
	decoded: `Hello-Another-Way-\u305D\u308C\u305E\u308C\u306E\u5834\u6240`,
	encoded: 'Hello-Another-Way--fc4qua05auwb3674vfr0b',
}, {
	decoded: `\u3072\u3068\u3064\u5C4B\u6839\u306E\u4E0B2`,
	encoded: '2-u9tlzr9756bt3uc0v',
}, {
	decoded: `Maji\u3067Koi\u3059\u308B5\u79D2\u524D`,
	encoded: 'MajiKoi5-783gue6qz075azm5e',
}, {
	decoded: '\u30D1\u30D5\u30A3\u30FCde\u30EB\u30F3\u30D0',
	encoded: 'de-jg4avhby1noc0d',
}, {
	decoded: `\u305D\u306E\u30B9\u30D4\u30FC\u30C9\u3067`,
	encoded: 'd9juau41awczczp',
}]

const justAscii: Test[] = [{
	decoded: '-> $1.00 <-',
	encoded: '-> $1.00 <--'
}]

describe('Punycode encoder/decoder', () => {
	describe('Given an encoder', () => {
		for (const { i, test: { decoded, encoded } } of justAscii.map((test, i) => ({ test, i }))) {
			describe(`And a text with just ascii [${i}]`, () => {
				it('Successfully encode strings', () => {
					expect(punycode.encode(decoded)).to.equal(encoded)
				})
			})
		}

		for (const [name, { decoded, encoded }] of Object.entries(examples)) {
			describe(`And a language example [${name}]`, () => {
				it('Successfully encode strings', () => {
					expect(punycode.encode(decoded)).to.equal(encoded)
				})
			})
		}

		for (const { i, test: { decoded, encoded } } of japaneseExamples.map((test, i) => ({ test, i }))) {
			describe(`And a japanese example [${i}]`, () => {
				it('Successfully encode strings', () => {
					expect(punycode.encode(decoded)).to.equal(encoded)
				})
			})
		}
	})
})
