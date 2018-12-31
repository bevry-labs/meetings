import fetch from 'isomorphic-unfetch'
import { filter } from '../shared/links'
import Link from '../client/components/link'
import Layout from '../client/components/layout'
import Events from '../client/components/events'
import { useWhen } from '../client/hooks/moment'
import { DisplayText } from '@shopify/polaris'
import {
	RawEventsType,
	RichEventsType,
	RichEventType,
	RawEventType
} from '../types'
import moment from 'moment'

type RawProps = { rawEvents: RawEventsType }
type RichProps = { events: RichEventsType }

const DEVELOPMENT = true
const EXPIRES = { minutes: 1 }

function firstLine(str?: string): string {
	return (str || '').split(/\s*\n\s*/)[0]
}

/**
 * Hydrate the event.
 *
 * Why here instead of getInitialProps?
 * Because "Data returned from getInitialProps is serialized when server rendering, similar to a JSON.stringify. Make sure the returned object from getInitialProps is a plain Object and not using Date, Map or Set.".
 * As such, getInitialProps would turn the moment instances into strings.
 *
 * Why do this at all?
 * To pevent components having to redo the same calculations on each render.
 * To ensure that events start at second:0, millisecond:0, as otherwise weird bugs occur in time comparisons and display.
 */
function enrichEvent(rawEvent: RawEventType): RichEventType {
	const description = firstLine(rawEvent.description)
	const summary = rawEvent.summary || 'Untitled'
	const start = moment(rawEvent.start.dateTime).set({
		seconds: 0,
		milliseconds: 0
	})
	const end = moment(rawEvent.end.dateTime).set({ seconds: 0, milliseconds: 0 })
	const expires = end.clone().add(EXPIRES)
	return Object.assign({}, rawEvent, {
		description,
		summary,
		start,
		end,
		expires
	})
}

const Page = ({ rawEvents }: RawProps) => {
	const events = rawEvents.map(enrichEvent)
	useWhen(...events.map(event => event.expires))
	return (
		<Layout>
			<DisplayText size="small">
				The Jordan B Peterson Community is a fan-led initiative of a{' '}
				<Link id="study-group" />, <Link id="reading-group" />,{' '}
				<Link id="lecture-notes" />, and <Link id="podcast" text="Podcast" />.
			</DisplayText>
			{events.length ? <Events events={events} /> : ''}
			<ul>
				{filter('home').map(link => (
					<li key={link.id}>
						<Link id={link.id} />
					</li>
				))}
			</ul>
		</Layout>
	)
}

Page.getInitialProps = function(): Promise<RawProps> {
	return fetch('//jordanbpeterson.community/api/events/')
		.then(response => response.json())
		.then(function(rawEvents: RawEventsType) {
			// if development, convert the events to more recent ones
			if (DEVELOPMENT) {
				rawEvents = rawEvents.map((rawEvent, index) => {
					const start = moment()
						.add({ minutes: 1 + index })
						.toISOString()
					const end = moment()
						.add({ minutes: 2 + index })
						.toISOString()
					return Object.assign({}, rawEvent, {
						start: { dateTime: start },
						end: { dateTime: end }
					})
				})
			}
			return { rawEvents }
		})
		.catch(err => {
			console.warn(err)
			return { rawEvents: [] }
		})
}

export default Page
