import fetch from 'isomorphic-unfetch'
import { filter } from '../data/links'
import Link from '../components/link'
import Layout from '../components/layout'
import Events from '../components/events'
import { DisplayText } from '@shopify/polaris'
import { RawEventsType, RichEventsType } from '../types'
import moment from 'moment'
type Props = { events: RawEventsType | null }
const Page = ({ events }: Props) => (
	<Layout>
		<DisplayText size="small">
			The Jordan B Peterson Community is a fan-led initiative of a{' '}
			<Link id="study-group" />, <Link id="reading-group" />,{' '}
			<Link id="lecture-notes" />, and <Link id="podcast" text="Podcast" />.
		</DisplayText>
		{events ? <Events events={events} /> : ''}
		<ul>
			{filter('home').map(link => (
				<li key={link.id}>
					<Link id={link.id} />
				</li>
			))}
		</ul>
	</Layout>
)

Page.getInitialProps = function(): Promise<Props> {
	return fetch('//jordanbpeterson.community/api/events/')
		.then(response => response.json())
		.catch(err => {
			console.warn(err)
			return { events: null }
		})
		.then(function(rawEvents: RawEventsType) {
			const events = rawEvents.map((rawEvent, index) => {
				const result = Object.assign({}, rawEvent)
				result.start.dateTime = moment()
					.add({ minutes: 1 + index })
					.set({ seconds: 0 })
					.toISOString()
				result.end.dateTime = moment()
					.add({ minutes: 2 + index })
					.set({ seconds: 0 })
					.toISOString()
				return result
			})
			/*
			const richEvents = rawEvents.map(rawEvent =>
				Object.assign({}, rawEvent, {
					start: moment(rawEvent.start.dateTime),
					end: moment(rawEvent.end.dateTime)
				})
			)
			*/
			return { events }
		})
}

export default Page
