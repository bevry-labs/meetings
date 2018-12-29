import { calendar_v3 } from 'googleapis'
import { Moment } from 'moment'

type Time = { dateTime: string; timeZone: string }
export interface RawEventType extends calendar_v3.Schema$Event {
	start: Time
	end: Time
	originalStartTime: Time
}
export type RawEventsType = RawEventType[]

export type RichEventType = RawEventType & {
	start: Moment
	end: Moment
}
export type RichEventsType = RichEventType[]

export type Children = Array<string | JSX.Element>
