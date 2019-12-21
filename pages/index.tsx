// External
import React, { useState, useEffect, useCallback } from 'react'
import Router from 'next/router'
import { IncomingMessage } from 'http'
import Daet from 'daet'

// Polaris
import { DisplayText, Layout, PageActions } from '@shopify/polaris'

// Local
import Page from '../components/page'
import { useFauna } from '../shared/config'

// Events
import Events from '../components/events'
import { IndexProps, RichEventType, RichEventsType } from '../shared/types'
import { fetchRawEvents, enrichEvents } from '../shared/events'
import { getHostname } from '../shared/util'

// Page
function IndexPage({ rawEvents }: IndexProps) {
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
					onAction() {
						Router.push('/events/add')
					}
				}}
			/>
		</Page>
	)
}

// Fetch
IndexPage.getInitialProps = function({
	req
}: {
	req: IncomingMessage
}): Promise<IndexProps> {
	const hostname = getHostname(req)
	return fetchRawEvents({ hostname }).then(rawEvents => ({
		rawEvents
	}))
}

// Export
export default IndexPage
