import { filter } from '../shared/links'
import Link from '../client/components/link'
import Layout from '../client/components/layout'
import Events from '../client/components/events'
import { DisplayText } from '@shopify/polaris'
import { RawEventsType, enrichEvents, fetchRawEvents } from '../shared/events'

type Props = {
	rawEvents: RawEventsType
}

const Page = ({ rawEvents }: Props) => {
	const events = enrichEvents(rawEvents)
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

Page.getInitialProps = function({ req }: { req: any }): Promise<Props> {
	return fetchRawEvents().then(rawEvents => ({ rawEvents }))
}

export default Page
