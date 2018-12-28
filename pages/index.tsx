import fetch from 'isomorphic-unfetch'
import { filter } from '../data/links'
import Link from '../components/link'
import AppLayout from '../components/layout'
import Events from '../components/events'
import { DisplayText } from '@shopify/polaris'
import { EventsType } from '../api/calendar'
type Props = { events: EventsType }
const Page = ({ events }: Props) => (
	<AppLayout>
		<DisplayText size="small">
			The Jordan B Peterson Community is a fan-led initiative of a{' '}
			<Link id="study-group" />, <Link id="reading-group" />,{' '}
			<Link id="lecture-notes" />, and <Link id="podcast" text="Podcast" />.
		</DisplayText>
		<Events events={events} />
		<ul>
			{filter('home').map(link => (
				<li key={link.id}>
					<Link id={link.id} />
				</li>
			))}
		</ul>
	</AppLayout>
)

Page.getInitialProps = function(): Promise<Props> {
	return fetch('//jordanbpeterson.community/api/events/')
		.then(response => response.json())
		.then(events => ({
			events
		}))
}

export default Page
