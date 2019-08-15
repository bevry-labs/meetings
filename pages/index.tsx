import React from 'react'
import Page from '../client/components/page'

// Polaris
import { DisplayText, Layout } from '@shopify/polaris'

// Events
import Events from '../client/components/events'
import { IndexProps } from '../shared/types'
import { fetchRawEvents, enrichEvents } from '../client/events'
import { IncomingMessage } from 'http'

// Page
function IndexPage({ rawEvents }: IndexProps) {
	console.log({ rawEvents })
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
		</Page>
	)
}

// Fetch
IndexPage.getInitialProps = function({
	req
}: {
	req: IncomingMessage
}): Promise<IndexProps> {
	const host = req.headers.host || ''
	const hostname = host
		? host.startsWith('localhost')
			? `http://${host}`
			: `https://${host}`
		: 'https://meet.bevry.me/api/events'
	return fetchRawEvents({ hostname }).then(rawEvents => ({
		rawEvents
	}))
}

// Export
export default IndexPage
