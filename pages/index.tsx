import React from 'react'
import Page from '../client/components/page'

// Polaris
import { DisplayText, Layout } from '@shopify/polaris'

// Events
import Events from '../client/components/events'
import { IndexProps } from '../shared/types'
import { fetchRawEvents, enrichEvents } from '../client/events'

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
	req: any
}): Promise<IndexProps> {
	return fetchRawEvents().then(rawEvents => ({ rawEvents }))
}

// Export
export default IndexPage
