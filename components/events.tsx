import { Layout, Banner, CalloutCard, ComplexAction } from '@shopify/polaris'
import { EventsType, EventType } from '../types'
import moment from 'moment'
function firstLine(str?: string): string {
	return (str || '').split(/\s*\n\s*/)[0]
}

const Event = ({ event }: { event: EventType }) => {
	const confidential = Boolean(event.hangoutLink)
	const illustration = confidential
		? '/static/illustrations/undraw_security_o890.svg'
		: '/static/illustrations/undraw_conference_uo36.svg'
	const start = moment(event.start.dateTime)
	const end = moment(event.end.dateTime)
	const now = moment()
	const live = now.isBetween(start, end)
	const when = live ? (
		<Banner title="Live Now" status="success">
			<p>Session is happening right now.</p>
		</Banner>
	) : (
		<Banner title={`Live ${start.fromNow()}`} status="info">
			<p>Join us {start.calendar()} your time.</p>
		</Banner>
	)
	const joinUrl = event.hangoutLink
	const watchUrl = confidential ? undefined : '/youtube'
	const primaryAction = {
		content: 'Join the call',
		disabled: !live,
		url: joinUrl,
		external: true
	} as ComplexAction
	const secondaryAction = confidential
		? undefined
		: ({
				content: 'Watch live',
				disabled: !live,
				url: watchUrl,
				external: true
		  } as ComplexAction)
	return (
		<div>
			<CalloutCard
				title={event.summary as string}
				illustration={illustration}
				primaryAction={primaryAction}
				secondaryAction={secondaryAction}
			>
				<p>{firstLine(event.description)}</p>
			</CalloutCard>
			{when}
		</div>
	)
}
export default ({ events }: { events: EventsType }) => (
	<Layout sectioned={true}>
		{events.map(event => (
			<Layout.Section key={event.id} secondary>
				<Event event={event} />
			</Layout.Section>
		))}
	</Layout>
)
