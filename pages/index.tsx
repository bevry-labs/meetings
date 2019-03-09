import React from 'react'
import Page from '../client/components/page'

// Polaris
import { DisplayText, Layout } from '@shopify/polaris'

// Events
import Events from '../client/components/events'
import { RawEventsType, fetchRawEvents, enrichEvents } from '../client/events'

type Props = {
	rawEvents: RawEventsType
}

function IndexPage({ rawEvents }: Props) {
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

IndexPage.getInitialProps = function({ req }: { req: any }): Promise<Props> {
	return fetchRawEvents().then(rawEvents => ({ rawEvents }))
}

export default IndexPage
