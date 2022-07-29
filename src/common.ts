export interface Alphabet extends Iterable<string> {
	length: number
	getAt(index: number): string
	indexOf(char: string): number
}

export interface NthBase {
	readonly base: number
	readonly digits: readonly string[]
	readonly values: Readonly<Record<string, number>>
}

export class SimpleNthBase implements NthBase {
	public readonly values: Readonly<Record<string, number>>

	public constructor(
		public readonly digits: readonly string[]
	) {
		this.values = Object.fromEntries(
			digits.map((digit, value) => [digit, value])
		)
	}

	public get base(): number {
		return this.digits.length
	}
}
