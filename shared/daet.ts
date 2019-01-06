/* eslint no-dupe-class-members:0, no-throw-literal:0, no-case-declarations:0 */
import * as intl from './intl'
import { StrictUnion } from './types'
import memo from './memo'

type SetUnits = 'millisecond' | 'second' | 'minute' | 'hour'
type ArithmeticUnits =
	| 'millisecond'
	| 'second'
	| 'minute'
	| 'hour'
	| 'week'
	| 'day'
type Input = string | number | Date | Daet

export const Millisecond = 1
export const Second = Millisecond * 1000
export const Minute = Second * 60
export const Hour = Minute * 60
export const Day = Hour * 24
export const Week = Day * 7

type BaseTier = {
	refresh?: number
	message: (opts: { past: boolean; delta: number; when: Daet }) => string
}
type LimitTier = BaseTier & {
	limit: number
}
type WhenTier = BaseTier & {
	when: (opts: { past: boolean }) => number
}
type Tier = StrictUnion<LimitTier | WhenTier>

export default class Daet {
	readonly raw: Date
	static get tiers(): Tier[] {
		return [
			{
				// right now
				limit: Second,
				refresh: Second,
				message: intl.rightNow
			},
			{
				// x seconds
				limit: Minute,
				refresh: Second,
				message: intl.relativeDelta
			},
			{
				// x minutes
				limit: Hour,
				refresh: Minute,
				message: intl.relativeDelta
			},
			{
				// x hours x minutes
				limit: 12 * Hour,
				refresh: Minute,
				message: intl.relativeDelta
			},
			{
				// later/earlier today
				when: ({ past }) =>
					past
						? new Daet().reset('hour').getTime()
						: new Daet()
								.plus(1, 'day')
								.reset('hour')
								.getTime(),
				message: intl.earlierOrLaterToday
			},
			{
				// yesterday or tomorrow
				when: ({ past }) =>
					past
						? new Daet()
								.minus(1, 'day')
								.reset('hour')
								.getTime()
						: new Daet()
								.plus(2, 'day')
								.reset('hour')
								.getTime(),
				message: intl.yesterdayOrTommorow
			},
			{
				// this week
				when: ({ past }) =>
					past
						? new Daet().endOfLastWeek().getTime()
						: new Daet().startOfNextWeek().getTime(),
				message: intl.relativeThisWeek
			},
			{
				// next or last week
				when: ({ past }) =>
					past
						? new Daet()
								.endOfLastWeek()
								.endOfLastWeek()
								.getTime()
						: new Daet()
								.startOfNextWeek()
								.startOfNextWeek()
								.getTime(),
				message: intl.relativeSecondWeek
			},
			{
				// earlier or later
				limit: Infinity,
				message: intl.earlierOrLater
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
		return this.plus(value * -1, unit)
	}
	plus(value: number, unit: ArithmeticUnits): Daet {
		switch (unit) {
			case 'millisecond': {
				const next = new Date(this.raw.getTime() + value)
				return new Daet(next)
			}
			case 'second': {
				return this.plus(value * Second, 'millisecond')
			}
			case 'minute': {
				return this.plus(value * Minute, 'millisecond')
			}
			case 'hour': {
				return this.plus(value * Hour, 'millisecond')
			}
			case 'day': {
				return this.plus(value * Day, 'millisecond')
			}
			case 'week': {
				return this.plus(value * Week, 'millisecond')
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
	getMillisecondsFrom(from: Daet): number {
		const now = from.getRoundedTime()
		const time = this.getRoundedTime()
		return time - now
	}
	getMillisecondsFromNow(): number {
		return this.getMillisecondsFrom(new Daet())
	}
	format(locale: string, options: object): string {
		return new Intl.DateTimeFormat(locale, options).format(this.raw)
	}
	startOfNextWeek = memo(
		(): Daet => {
			// continue until we become the start of next week
			let latest: Daet = this.plus(1, 'day')
			while (latest.raw.getDay() !== intl.StartOfWeek) {
				latest = latest.plus(1, 'day')
			}
			// reset the time, so we become the start time of that week
			return latest.reset('hour')
		}
	)
	endOfLastWeek = memo(
		(): Daet => {
			// continue until we become the start of this week
			let latest: Daet = this
			while (latest.raw.getDay() !== intl.StartOfWeek) {
				latest = latest.minus(1, 'day')
			}
			// reset the time, then minus a second, so we become the end of the prior week
			return latest.reset('hour').minus(1, 'second')
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
	fromNowDetails() {
		const now = new Daet()
		const nowTime = now.getRoundedTime()
		const eventTime = this.getRoundedTime()
		const past = nowTime > eventTime
		const delta = Math.abs(eventTime - nowTime)
		const tiers = Daet.tiers
		let lastTierDelta: number = 0
		// console.log('---')
		for (const tier of tiers) {
			const limit = tier.limit
			const when = tier.when ? tier.when({ past }) : 0
			const tierDelta = limit || Math.abs(when - nowTime)
			// console.log({ limit, when, eventTime, nowTime, tierDelta, delta, tier })
			if (delta < tierDelta) {
				const message = tier.message({ past, delta, when: this })
				const refresh = tier.refresh || delta - lastTierDelta
				return { message, refresh }
			}
			lastTierDelta = tierDelta
		}
		throw new Error('no tier matched the input delta')
	}
	fromNow() {
		return this.fromNowDetails().message
	}
	toISOString = memo(() => this.raw.toISOString())
	toJSON = memo(() => this.raw.toJSON())
}
