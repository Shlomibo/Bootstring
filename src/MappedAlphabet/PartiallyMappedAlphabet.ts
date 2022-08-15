import { MappedAlphabetBase } from './MappedAlphabetBase'

export class PartiallyMappedAlphabet extends MappedAlphabetBase {
	public has(char: string): boolean {
		return char in this._reverseMapping
			? this._base.has(this._reverseMapping[char])
			: this._base.has(char)

	}

	public getAt(index: number): string {
		const baseChar = this._base.getAt(index)
		return baseChar in this._mapping
			? this._mapping[baseChar]
			: baseChar
	}

	public indexOf(char: string): number {
		return this._base.indexOf(
			char in this._reverseMapping
				? this._reverseMapping[char]
				: char
		)
	}

	public *[Symbol.iterator]() {
		for (const ch of this._base) {
			yield ch in this._mapping
				? this._mapping[ch]
				: ch
		}
	}
}
