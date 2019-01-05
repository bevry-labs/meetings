import { number } from 'prop-types'
import * as formatMessage from 'format-message'

/* eslint no-dupe-class-members:0, no-throw-literal:0, no-case-declarations:0 */

type CustomMessageOptions = { now: Dato; seconds: number }

type Input = string | number | Date
type Unit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day'
/*
type Tier =
	| {
			singular?: string
			plural: string
			unit: number
			limit: number
	  }
	| {
			custom: (options: CustomMessageOptions) => string
			unit: number
			limit: number
	  }
	*/

/*
type Parts = {
	year: number
	month: number
	date: number
	day: number
	hour: number
	minute: number
	second: number
	time: number
}
*/

export const Millisecond = 1
export const Second = Millisecond * 1000
export const Minute = Second * 60
export const Hour = Minute * 60
export const Day = Hour * 24
export const Week = Day * 7

/*
const tiers: Tiers = [
	{ unit: 0, limit: Second, plural: 'right now' },
	{
		unit: Second,
		limit: Minute,
		singular: '%d second',
		plural: '%d seconds'
	},
	{
		unit: Minute,
		limit: Hour,
		singular: '%d minute',
		plural: '%d minutes'
	},
	{ unit: Hour, limit: Day, singular: '%d hour', plural: '%d hours' },
	{ unit: Day, limit: Infinity, singular: '%d day', plural: '%d days' }
]
*/

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

/*
function sp(value: number, singular: string, plural: string) {
	return value ? (value + ' ' + (value % 2) ? plural : singular) : ''
}
*/

/*
type TierTime =
	| {
			limit: number
	  }
	| {
			when: number
	  }
type TierMessage =
	| {
			message: string
	  }
	| {
			custom: (delta: number) => string
	  }
type Tier = TierTime & TierMessage
*/
interface Tier {
	limit?: number
	when?: number
	message?: string
	custom?: (delta: number, when: Dato) => string
}

formatMessage.setup({
	missingTranslation: 'ignore'
})

export default class Dato {
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
				when: new Dato()
					.add(1, 'day')
					.reset('hour')
					.getTime(),
				message: 'later today'
			},
			{
				when: new Dato()
					.add(2, 'day')
					.reset('hour')
					.getTime(),
				message: 'tomorrow'
			},
			{
				when: new Dato().nextWeek().getTime(),
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
				when: new Dato()
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
	static create(input?: Input): Dato {
		return new this(input)
	}
	constructor(input?: Input) {
		this.raw = input ? new Date(input) : new Date()
	}
	minus(value: number, unit: Unit): Dato {
		return this.add(value * -1, unit)
	}
	add(value: number, unit: Unit): Dato {
		switch (unit) {
			case 'millisecond': {
				const next = new Date(this.raw.getTime() + value)
				return new Dato(next)
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
	set(value: number, unit: 'millisecond' | 'second' | 'minute' | 'hour'): Dato {
		switch (unit) {
			case 'millisecond': {
				const next = this.rawClone().setMilliseconds(value)
				return new Dato(next)
			}
			case 'second': {
				const next = this.rawClone().setSeconds(value)
				return new Dato(next)
			}
			case 'minute': {
				const next = this.rawClone().setMinutes(value)
				return new Dato(next)
			}
			case 'hour': {
				const next = this.rawClone().setHours(value)
				return new Dato(next)
			}
			default:
				// https://basarat.gitbooks.io/typescript/docs/types/discriminated-unions.html
				const neverCheck: never = unit
				throw new Error('unknown unit')
		}
	}
	reset(unit: 'millisecond' | 'second' | 'minute' | 'hour'): Dato {
		switch (unit) {
			case 'millisecond': {
				const next = this.rawClone().setMilliseconds(0)
				return new Dato(next)
			}
			case 'second': {
				const next = this.rawClone().setSeconds(0, 0)
				return new Dato(next)
			}
			case 'minute': {
				const next = this.rawClone().setMinutes(0, 0, 0)
				return new Dato(next)
			}
			case 'hour': {
				const next = this.rawClone().setHours(0, 0, 0, 0)
				return new Dato(next)
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
		const now = new Dato().getRoundedTime()
		const time = this.getRoundedTime()
		return time - now
	}
	format(locale: string, options: object): string {
		return new Intl.DateTimeFormat(locale, options).format(this.raw)
	}
	nextWeek(): Dato {
		let latest = this.add(1, 'day')
		while (latest.raw.getDay() !== 0) {
			latest = latest.add(1, 'day')
		}
		return latest.reset('hour')
	}
	fromNow(): string {
		const delta = Math.abs(this.getDelta())
		const time = this.getRoundedTime()
		console.log('--', delta, '-------------')
		const tiers = Dato.tiers
		console.log('--', delta, '-------------')
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
	/*
	fromNow(): string {
		const delta = Math.abs(this.getDeltaSeconds())
		const tiers = this.tiers
		console.log('--', delta, '-------------')
		for (const { unit, limit } of tiers) {
			const within = delta < limit
			if (within) {
				const unitDelta = Math.ceil(delta / unit)
				const message = unitDelta > 1 ? plural : singular
				console.log(delta, limit, within, unit, unitDelta, message)
				return message.replace('%d', unitDelta.toString())
			}
		}
		throw new Error('no tier matched the input delta')
	}
	getParts(): Parts {
		const raw = this.raw
		return {
			year: raw.getFullYear(),
			month: raw.getMonth(),
			date: raw.getDate(),
			day: raw.getDay(),
			hour: raw.getHours(),
			minute: raw.getMinutes(),
			second: raw.getSeconds(),
			time: raw.getTime()
		}
	}
	diff(B: Dato): Parts {
		const a = this.getParts()
		const b = B.getParts()
		return {
			year: a.year - b.year,
			month: a.month - b.month,
			date: a.date - b.date,
			day: a.day - b.day,
			hour: a.hour - b.hour,
			minute: a.minute - b.minute,
			second: a.second - b.second,
			time: a.time - b.time
		}
	}
	*/
	toISOString(): string {
		return this.raw.toISOString()
	}
	toJSON(): string {
		return this.raw.toJSON()
	}
}

/*
import Dato from './shared/dato'
Dato.create().add(30, 'second').getSecondsDelta()
*/
