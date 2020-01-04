// Extenral
import Daet from 'daet'

// Internal
import fetchJSON from '../shared/fetch'
import { RawEventSchema, RichEventSchema } from '../shared/schemas'
import { TEST_STATES } from '../shared/config'
function firstLine(str?: string): string {
	return (str || '').split(/\s*(\n|<br>)\s*/)[0]
}

// runs on client+server
// export function fetchRawEvents(hostname: string) {}
export function fetchRawEvents({
	hostname
}: {
	hostname: string
}): Promise<RawEventSchema[]> {
	const url = hostname + '/api/events/list'
	return fetchJSON(url)
		.then(function(rawEvents: RawEventSchema[]) {
			// if TEST_STATES, convert the events to more recent ones
			if (TEST_STATES) {
				// modify the events we receive, to start one minute from now, finish one minute after start,
				// expire one minute after finish so that we can as the developer see the progression between
				// the states quickly.
				const now = new Daet()
				return (
					rawEvents
						// convert
						.map((rawEvent, index) => {
							const minutes = 1 + index
							return {
								...rawEvent,
								start: now.plus(index + 1, 'minute').toISOString(),
								finish: now.plus(index + 2, 'minute').toISOString(),
								expiry: now.plus(index + 3, 'minute').toISOString()
							}
						})
						// fetch only the first
						.slice(0, 1)
				)
			}
			return rawEvents
		})
		.catch(err => {
			console.warn('FAILED TO FETCH EVENTS FROM:', url, err)
			return []
		})
}

/**
 * Hydrate the event.
 *
 * Why here instead of getInitialProps?
 * Because "Data returned from getInitialProps is serialized when server rendering, similar to a JSON.stringify. Make sure the returned object from getInitialProps is a plain Object and not using Date, Map or Set.".
 * As such, getInitialProps would turn the date instances into strings.
 *
 * Why do this at all?
 * To pevent components having to redo the same calculations on each render.
 * To ensure that events start at second:0, millisecond:0, as otherwise weird bugs occur in time comparisons and display.
 */
export function enrichEvent(rawEvent: RawEventSchema): RichEventSchema {
	// const description = firstLine(rawEvent.description || '')
	// new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"})
	// start: new Daet(new Date(event.start).toLocaleString("en-US", {timeZone: event.tz}))
	return {
		...rawEvent,
		start: new Daet(rawEvent.start).reset('second'),
		finish: new Daet(rawEvent.finish).reset('second'),
		expiry: new Daet(rawEvent.expiry).reset('second')
	}
}

export function enrichEvents(rawEvents: RawEventSchema[]): RichEventSchema[] {
	return rawEvents.map(enrichEvent)
}
