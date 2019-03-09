import React from 'react'
import Page from '../client/components/page'

// Polaris
import { DisplayText, Layout } from '@shopify/polaris'

// Events
import Events from '../client/components/events'
import { RawEventsType, fetchRawEvents, enrichEvents } from '../client/events'

// Props
type Props = {
	rawEvents: RawEventsType
}

// Page
function IndexPage({ rawEvents }: Props) {
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
IndexPage.getInitialProps = function({ req }: { req: any }): Promise<Props> {
	return fetchRawEvents().then(rawEvents => ({ rawEvents }))
}

// Export
export default IndexPage
