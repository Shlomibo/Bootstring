import { expect } from 'chai'
import { UnicodeSubsetAlphabet } from './UnicodeSubsetAlphabet'

describe('UnicodeSubsetAlphabet', () => {
	describe('Given the entire unicode alphabet', () => {
		const unicode = UnicodeSubsetAlphabet.unicode

		it('Has the correct length', () => {
			expect(unicode.length).to.equal(0x10FFFF - (0xDFFF - 0xD800))
		})

		describe('then each character', () => {
			it('Successfully switches between index and character', () => {
				let i = 0
				for (const ch of unicode) {
					expect(unicode.indexOf(ch), 'compare index').to.equal(i)
					expect(unicode.getAt(i), 'compare characters').to.equal(ch)

					i++
				}
			})
				.timeout(300_000)
				.slow(150_000)
		})
	})

	describe('Given a partial alphabet', () => {
		const alphabet = new UnicodeSubsetAlphabet({
			start: '0',
			end: '9',
		})

		it('Has the correct length', () => {
			expect(alphabet.length).to.equal(10)
		})

		describe('then each character', () => {
			it('Successfully switches between index and character', () => {
				let i = 0
				for (const ch of alphabet) {
					expect(alphabet.indexOf(ch), 'compare index').to.equal(i)
					expect(alphabet.getAt(i), 'compare characters').to.equal(ch)

					i++
				}
			})
		})
	})
})
