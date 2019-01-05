/* eslint no-dupe-class-members:0, no-throw-literal:0, no-case-declarations:0 */
import * as formatMessage from 'format-message'

type UnitsToHour = 'millisecond' | 'second' | 'minute' | 'hour'
type UnitsToDay = 'millisecond' | 'second' | 'minute' | 'hour' | 'day'
type Input = string | number | Date

interface Tier {
	limit?: number
	when?: number
	message?: string
	custom?: (delta: number, when: Daet) => string
}

export const Millisecond = 1
export const Second = Millisecond * 1000
export const Minute = Second * 60
export const Hour = Minute * 60
export const Day = Hour * 24
export const Week = Day * 7

const intl = {
	now: 'right now',
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
	laterToday: `later today`,
	earlierToday: 'earlier today',
	tomorrow: `tomorrow`,
	yesterday: `yesterday`,
	thisWeek: `this {value}`,
	nextWeek: `next {value}`
}

formatMessage.setup({
	missingTranslation: 'ignore'
})

export default class Daet {
	readonly raw: Date
	static get tiers(): Tier[] {
		return [
			{ limit: Second, message: intl.now },
			{
				limit: Minute,
				custom: delta =>
					formatMessage(intl.seconds, { seconds: Math.floor(delta / Second) })
			},
			{
				limit: Hour,
				custom: delta =>
					formatMessage(intl.minutes, { minutes: Math.floor(delta / Minute) })
			},
			{
				limit: 12 * Hour,
				custom: delta => {
					const hours = Math.floor(delta / Hour)
					const minutes = Math.floor((delta - hours * Hour) / Minute)
					return formatMessage(intl.hours, { hours, minutes })
				}
			},
			{
				when: new Daet()
					.add(1, 'day')
					.reset('hour')
					.getTime(),
				message: 'later today'
			},
			{
				when: new Daet()
					.add(2, 'day')
					.reset('hour')
					.getTime(),
				message: 'tomorrow'
			},
			{
				when: new Daet().nextWeek().getTime(),
				custom: (delta, when) =>
					formatMessage(intl.thisWeek, {
						value: when.format('en', {
							weekday: 'long'
							// hour: 'numeric',
							// minute: 'numeric'
						})
					})
			},
			{
				when: new Daet()
					.nextWeek()
					.nextWeek()
					.getTime(),
				custom: (delta, when) =>
					formatMessage(intl.nextWeek, {
						value: when.format('en', {
							weekday: 'long'
							// hour: 'numeric',
							// minute: 'numeric'
						})
					})
			},
			{
				limit: Infinity,
				message: 'sometime later'
			}
		]
	}
	static create(input?: Input): Daet {
		return new this(input)
	}
	constructor(input?: Input) {
		this.raw = input ? new Date(input) : new Date()
	}
	minus(value: number, unit: UnitsToDay): Daet {
		return this.add(value * -1, unit)
	}
	add(value: number, unit: UnitsToDay): Daet {
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
			default:
				// https://basarat.gitbooks.io/typescript/docs/types/discriminated-unions.html
				const neverCheck: never = unit
				throw new Error('unknown unit')
		}
	}
	private rawClone() {
		return new Date(this.raw)
	}
	set(value: number, unit: UnitsToHour): Daet {
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
	reset(unit: UnitsToHour): Daet {
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
	getRoundedTime(): number {
		return Math.round(this.getTime() / 1000) * 1000
	}
	getDelta(): number {
		const now = new Daet().getRoundedTime()
		const time = this.getRoundedTime()
		return time - now
	}
	format(locale: string, options: object): string {
		return new Intl.DateTimeFormat(locale, options).format(this.raw)
	}
	nextWeek(): Daet {
		let latest = this.add(1, 'day')
		while (latest.raw.getDay() !== 0) {
			latest = latest.add(1, 'day')
		}
		return latest.reset('hour')
	}
	fromNow(): string {
		const delta = Math.abs(this.getDelta())
		const time = this.getRoundedTime()
		const tiers = Daet.tiers
		for (const tier of tiers) {
			const limit = !tier.limit || delta < tier.limit
			const when = !tier.when || time < tier.when
			const within = limit && when
			if (within) {
				const message =
					tier.message != null
						? tier.message
						: tier.custom
						? tier.custom(delta, this)
						: ''
				return message
			}
		}
		throw new Error('no tier matched the input delta')
	}
	toISOString(): string {
		return this.raw.toISOString()
	}
	toJSON(): string {
		return this.raw.toJSON()
	}
}
