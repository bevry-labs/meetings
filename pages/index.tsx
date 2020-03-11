// External
import React, { useState, useEffect, useCallback } from 'react'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import { IncomingMessage } from 'http'
import Daet from 'daet'

import * as ReactDOMServer from 'react-dom/server'

// Polaris
import { DisplayText, Layout, PageActions } from '@shopify/polaris'

// Local
import Page from '../components/page'
import { RawEventSchema } from '../shared/schemas'

// Events
import Events from '../components/events/view'
import { fetchRawEvents, enrichEvents } from '../shared/events'
import { getHostname } from '../shared/util'

// ENV
import SHARED_ENV from '../shared/env'
import { loginUrl } from '../shared/config'

const TopBar = dynamic(() => import('../components/top_bar'), { ssr: false })

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
	console.log('XXX', SHARED_ENV.auth0.clientId, 'XXX')
	const events = enrichEvents(rawEvents)
	return (
		<div>
			<Layout.Section>
				<TopBar />
			</Layout.Section>
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
		</div>
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
