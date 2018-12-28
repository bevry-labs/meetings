import { Layout, Banner, Card, TextStyle, CalloutCard } from '@shopify/polaris'
import { EventsType, EventType } from '../api/calendar'
function firstLine(str?: string): string {
	return (str || '').split(/\s*\n\s*/)[0]
}

const Event = ({ event }: { event: EventType }) => {
	const live = !Boolean(event.hangoutLink)
	const illustration = live
		? '/static/illustrations/undraw_conference_uo36.svg'
		: '/static/illustrations/undraw_security_o890.svg'
	const secondaryAction = live ? { content: 'Watch live' } : undefined
	return (
		<div>
			<CalloutCard
				title={event.summary as string}
				illustration={illustration}
				primaryAction={{
					content: 'Join the call'
				}}
				secondaryAction={secondaryAction}
			>
				<p>{firstLine(event.description)}</p>
			</CalloutCard>
			<Banner title="Live Now" status="success">
				<p>This order was archived on March 7, 2017 at 3:12pm EDT.</p>
			</Banner>
		</div>
	)

	/* <Card title={event.summary} actions={[{ content: 'Manage' }]}>
			<Card.Section>
				<TextStyle variation="subdued">
					{firstLine(event.description)}
				</TextStyle>
			</Card.Section>
		</Card> */
}
export default ({ events }: { events: EventsType }) => (
	<Layout sectioned={true}>
		{events.map(event => (
			<Layout.Section secondary>
				<Event event={event} />
			</Layout.Section>
		))}
	</Layout>
)
