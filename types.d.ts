import { calendar_v3 } from 'googleapis'

type Time = { dateTime: string; timeZone: string }
export interface EventType extends calendar_v3.Schema$Event {
	start: Time
	end: Time
	originalStartTime: Time
}
export type EventsType = EventType[]

export type Children = Array<string | JSX.Element>
