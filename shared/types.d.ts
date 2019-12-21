import { calendar_v3 } from 'googleapis'

// Events
type Time = { dateTime: string; timeZone: string }
interface RawEventType extends calendar_v3.Schema$Event {
	start: Time
	end: Time
	originalStartTime: Time
}
type RawEventsType = RawEventType[]
type RichEventType = RawEventType & {
	description: string
	summary: string
	start: Daet
	end: Daet
	expires: Daet
}
type RichEventsType = RichEventType[]

// JSX
type Child = string | JSX.Element
type Children = Array<Child>

// Pages
interface LayoutProps {
	children: Children | Child
	title?: string
}
type IndexProps = {
	rawEvents: RawEventsType
}
