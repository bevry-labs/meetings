import React from 'react'
import Link from '../client/components/link'
import Page from '../client/components/page'
import { filter } from '../shared/links'
import { DisplayText, List, Layout } from '@shopify/polaris'
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
					A listing of everything that{' '}
					<a href="https://jordanbpeterson.com">Jordan B Peterson</a> fans are
					manifesting.
				</DisplayText>
			</Layout.Section>
			<Layout.Section>
				<List>
					{filter('home').map(link => (
						<List.Item key={link.id}>
							<Link id={link.id} />
						</List.Item>
					))}
				</List>
			</Layout.Section>
		</Page>
	)
}

IndexPage.getInitialProps = function({ req }: { req: any }): Promise<Props> {
	return fetchRawEvents().then(rawEvents => ({ rawEvents }))
}

export default IndexPage
