import React from 'react'
import { filter } from '../shared/links'
import Link from '../client/components/link'
import Page from '../client/components/page'
import Events from '../client/components/events'
import { DisplayText, List, Layout } from '@shopify/polaris'
import { RawEventsType, enrichEvents, fetchRawEvents } from '../shared/events'

type Props = {
	rawEvents: RawEventsType
}

function IndexPage({ rawEvents }: Props) {
	const events = enrichEvents(rawEvents)
	return (
		<Page>
			<Layout.Section>
				<DisplayText size="small">
					The Jordan B Peterson Community is a fan-led initiative of a{' '}
					<Link id="study-group" />, <Link id="reading-group" />,{' '}
					<Link id="lecture-notes" />, and <Link id="podcast" text="Podcast" />.
				</DisplayText>
			</Layout.Section>
			{events.length ? <Events events={events} /> : ''}
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
