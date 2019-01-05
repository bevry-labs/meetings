/* eslint no-dupe-class-members:0, no-throw-literal:0, no-case-declarations:0 */
import * as formatMessage from 'format-message'

type SetUnits = 'millisecond' | 'second' | 'minute' | 'hour'
type ArithmeticUnits =
	| 'millisecond'
	| 'second'
	| 'minute'
	| 'hour'
	| 'week'
	| 'day'
type Input = string | number | Date | Daet

interface Tier {
	limit?: number
	when?: (opts: { past: boolean }) => number
	message?: (opts: { past: boolean }) => string
	custom?: (opts: { past: boolean; delta: number; when: Daet }) => string
}

export const Millisecond = 1
export const Second = Millisecond * 1000
export const Minute = Second * 60
export const Hour = Minute * 60
export const Day = Hour * 24
export const Week = Day * 7

const Saturday = 6
const Sunday = 0
const Monday = 1
const StartOfWeek = Monday

const intl = {
	seconds: `{
		seconds, plural,
			=0 {}
		  one {# second}
		other {# seconds}
	}`,
	minutes: `{
		minutes, plural,
			=0 {}
		  one {# minute}
		other {# minutes}
	}`,
	hours: `{
		hours, plural,
			=0 {}
		  one {# hour}
		other {# hours}
	}{
		minutes, plural,
			=0 {}
		  one { # minute}
		other { # minutes}
	}`,
	thisWeek: `this {value}`,
	nextWeek: `next {value}`
}

formatMessage.setup({
	missingTranslation: 'ignore'
})

function memo<T>(callback: () => T) {
	let value: T
	return () => (typeof value !== 'undefined' ? value : (value = callback()))
}

export default class Daet {
	readonly raw: Date
	static get tiers(): Tier[] {
		return [
			{ limit: Second, message: () => 'right now' },
			{
				limit: Minute,
				custom: ({ past, delta }) => {
					const ticks = formatMessage(intl.seconds, {
						seconds: Math.floor(delta / Second)
					})
					return past ? `${ticks} ago` : `in ${ticks}`
				}
			},
			{
				limit: Hour,
				custom: ({ past, delta }) => {
					const ticks = formatMessage(intl.minutes, {
						minutes: Math.floor(delta / Minute)
					})
					return past ? `${ticks} ago` : `in ${ticks}`
				}
			},
			{
				limit: 12 * Hour,
				custom: ({ past, delta }) => {
					const hours = Math.floor(delta / Hour)
					const minutes = Math.floor((delta - hours * Hour) / Minute)
					const ticks = formatMessage(intl.hours, { hours, minutes })
					return past ? `${ticks} ago` : `in ${ticks}`
				}
			},
			{
				when: ({ past }) =>
					past
						? new Daet().reset('hour').getTime()
						: new Daet()
								.add(1, 'day')
								.reset('hour')
								.getTime(),
				message: ({ past }) => (past ? 'earlier today' : 'later today')
			},
			{
				when: ({ past }) =>
					past
						? new Daet()
								.minus(1, 'day')
								.reset('hour')
								.getTime()
						: new Daet()
								.add(2, 'day')
								.reset('hour')
								.getTime(),
				message: ({ past }) => (past ? 'yesterday' : 'tomorrow')
			},
			{
				when: ({ past }) =>
					past
						? new Daet().lastWeek().getTime()
						: new Daet().nextWeek().getTime(),
				custom: ({ past, delta, when }) =>
					past
						? 'earlier this week'
						: formatMessage(intl.thisWeek, {
								value: when.format('en', {
									weekday: 'long'
								})
						  })
			},
			{
				when: ({ past }) =>
					past
						? new Daet()
								.lastWeek()
								.lastWeek()
								.getTime()
						: new Daet()
								.nextWeek()
								.nextWeek()
								.getTime(),
				custom: ({ past, delta, when }) =>
					past
						? 'earlier last week'
						: formatMessage(intl.nextWeek, {
								value: when.format('en', {
									weekday: 'long'
								})
						  })
			},
			{
				limit: Infinity,
				message: ({ past }) => (past ? 'sometime earlier' : 'sometime later')
			}
		]
	}
	static create(input?: Input): Daet {
		return new this(input)
	}
	constructor(input?: Input) {
		this.raw =
			input instanceof Daet
				? new Date(input.raw)
				: input
				? new Date(input)
				: new Date()
	}
	minus(value: number, unit: ArithmeticUnits): Daet {
		return this.add(value * -1, unit)
	}
	add(value: number, unit: ArithmeticUnits): Daet {
		switch (unit) {
			case 'millisecond': {
				const next = new Date(this.raw.getTime() + value)
				return new Daet(next)
			}
			case 'second': {
				return this.add(value * Second, 'millisecond')
			}
			case 'minute': {
				return this.add(value * Minute, 'millisecond')
			}
			case 'hour': {
				return this.add(value * Hour, 'millisecond')
			}
			case 'day': {
				return this.add(value * Day, 'millisecond')
			}
			case 'week': {
				return this.add(value * Week, 'millisecond')
			}
			default:
				// https://basarat.gitbooks.io/typescript/docs/types/discriminated-unions.html
				const neverCheck: never = unit
				throw new Error('unknown unit')
		}
	}
	private rawClone() {
		return new Date(this.raw)
	}
	clone() {
		return new Daet(this)
	}
	set(value: number, unit: SetUnits): Daet {
		switch (unit) {
			case 'millisecond': {
				const next = this.rawClone().setMilliseconds(value)
				return new Daet(next)
			}
			case 'second': {
				const next = this.rawClone().setSeconds(value)
				return new Daet(next)
			}
			case 'minute': {
				const next = this.rawClone().setMinutes(value)
				return new Daet(next)
			}
			case 'hour': {
				const next = this.rawClone().setHours(value)
				return new Daet(next)
			}
			default:
				// https://basarat.gitbooks.io/typescript/docs/types/discriminated-unions.html
				const neverCheck: never = unit
				throw new Error('unknown unit')
		}
	}
	reset(unit: SetUnits): Daet {
		switch (unit) {
			case 'millisecond': {
				const next = this.rawClone().setMilliseconds(0)
				return new Daet(next)
			}
			case 'second': {
				const next = this.rawClone().setSeconds(0, 0)
				return new Daet(next)
			}
			case 'minute': {
				const next = this.rawClone().setMinutes(0, 0, 0)
				return new Daet(next)
			}
			case 'hour': {
				const next = this.rawClone().setHours(0, 0, 0, 0)
				return new Daet(next)
			}
			default:
				// https://basarat.gitbooks.io/typescript/docs/types/discriminated-unions.html
				const neverCheck: never = unit
				throw new Error('unknown unit')
		}
	}
	getTime(): number {
		return this.raw.getTime()
	}
	getRoundedTime = memo((): number => Math.round(this.getTime() / 1000) * 1000)
	getDelta(from: Daet = new Daet()): number {
		const now = from.getRoundedTime()
		const time = this.getRoundedTime()
		return time - now
	}
	format(locale: string, options: object): string {
		return new Intl.DateTimeFormat(locale, options).format(this.raw)
	}
	nextWeek = memo(
		(): Daet => {
			let latest = this.add(1, 'day')
			while (latest.raw.getDay() !== StartOfWeek) {
				latest = latest.add(1, 'day')
			}
			return latest.reset('hour')
		}
	)
	lastWeek = memo(
		(): Daet => {
			let latest = this.minus(1, 'day')
			while (latest.raw.getDay() !== StartOfWeek) {
				latest = latest.minus(1, 'day')
			}
			return latest.reset('hour')
		}
	)
	calendar(): string {
		return this.format('en', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		})
	}
	from(from: Daet) {
		const _delta = this.getDelta(from)
		const past = _delta < 0
		const delta = Math.abs(_delta)
		const time = this.getRoundedTime()
		const tiers = Daet.tiers
		for (const tier of tiers) {
			const limit = !tier.limit || delta < tier.limit
			const when = !tier.when || time < tier.when({ past })
			const within = limit && when
			if (within) {
				const message =
					tier.message != null
						? tier.message({ past })
						: tier.custom
						? tier.custom({ past, delta, when: this })
						: ''
				return message
			}
		}
		throw new Error('no tier matched the input delta')
	}
	fromNow() {
		return this.from(new Daet())
	}
	toISOString = memo(() => this.raw.toISOString())
	toJSON = memo(() => this.raw.toJSON())
}
