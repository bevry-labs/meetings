// External
import React from 'react'
import { IncomingMessage } from 'http'
import Router from 'next/router'
import { DisplayText, Layout, PageActions, Page } from '@shopify/polaris'

// Local
import Fountain from '../../components/layout'
import { RawEventSchema } from '../../shared/schemas'

// Events
import Events from '../../components/events/view'
import { fetchRawEvents, enrichEvents } from '../../shared/events'
import { getHostname } from '../../shared/util'
import { newEventUrl } from '../../shared/config'

// Page
function IndexPage({ rawEvents }: { rawEvents: RawEventSchema[] }) {
	/* TODO: Implement Effect for getting events from fauna.
	const [events, setEvents] = useState<RichEventsType>([])
	useEffect(() => {
		async function getEvents() {
			const rawEvents = await fetchRawEventsFromFauna({dbname: 'posts'})
			const events = enrichEvents(rawEvents)
			setEvents(events);
		}
	}, [])
	*/
	const events = enrichEvents(rawEvents)
	return (
		<Fountain url="/events/list" title="Events">
			<Page>
				<Layout.Section>
					<DisplayText size="small">
						Take part in <a href="https://bevry.me">Bevry</a>&apos;s{' '}
						<a href="https://bevry.me/meetings/">meetings</a>.
					</DisplayText>
				</Layout.Section>
				{events.length ? <Events events={events} /> : ''}
				<PageActions
					primaryAction={{
						content: 'Add',
						url: newEventUrl
					}}
				/>
			</Page>
		</Fountain>
	)
}

// Fetch
// Only serialisable data in here because if zeit has server rendered this, then it is a JSON object when instantiating the client-side initially, and waiting for the new props to be fetched
IndexPage.getInitialProps = function({
	req
}: {
	req: IncomingMessage
}): Promise<{ rawEvents: RawEventSchema[] }> {
	const hostname = getHostname(req)
	return fetchRawEvents({ hostname }).then(rawEvents => ({
		rawEvents
	}))
}

// Export
export default IndexPage
