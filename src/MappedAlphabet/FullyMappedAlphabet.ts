import { MappedAlphabetBase, MappedAlphabetParams } from './MappedAlphabetBase'

export class FullyMappedAlphabet extends MappedAlphabetBase {

	public constructor(params: MappedAlphabetParams) {
		super(params)

		const unmappedKeys = Array.from({
			*[Symbol.iterator]() {
				for (const ch of params.base) {
					if (!(ch in params.mapping)) {
						yield ch
					}
				}
			}
		})

		if (unmappedKeys.length > 0) {
			throw new Error(`All keys must be mapped.
Unmapped keys: ${unmappedKeys.map(ch => `"${ch}"`).join(', ')}`)
		}
	}

	public has(char: string): boolean {
		return char in this._reverseMapping &&
			this._base.has(this._reverseMapping[char])
	}

	public getAt(index: number): string {
		const baseChar = this._base.getAt(index)
		return this._mapping[baseChar]
	}

	public indexOf(char: string): number {
		if (!(char in this._reverseMapping)) {
			return -1
		}

		return this._base.indexOf(
			this._reverseMapping[char]
		)
	}

	public *[Symbol.iterator]() {
		for (const ch of this._base) {
			yield this._mapping[ch]
		}
	}
}
