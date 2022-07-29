export interface Alphabet extends Iterable<string> {
	length: number
	getAt(index: number): string
	indexOf(char: string): number
	has(char: string): boolean
}

export type DigitVariants = string[]

export interface NthBase {
	readonly base: number
	readonly digits: readonly DigitVariants[]
	readonly values: Readonly<Record<string, number>>
}

export class SimpleNthBase implements NthBase {
	public readonly values: Readonly<Record<string, number>>

	public constructor(
		public readonly digits: readonly DigitVariants[]
	) {
		this.values = Object.fromEntries(
			digits.flatMap((digits, value) =>
				digits.map(digit => [digit, value]
				))
		)
	}

	public get base(): number {
		return this.digits.length
	}
}
