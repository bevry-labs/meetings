import { Layout, Banner, CalloutCard, ComplexAction } from '@shopify/polaris'
import { RichEventsType, RichEventType } from '../../types'
import { useInterval } from '../hooks/time'
import Daet from '../../shared/daet'

const Event = ({ event }: { event: RichEventType }) => {
	// determine dates
	const { description, summary, start, end, expires } = event
	const now = new Daet()
	const started = now.getRoundedTime() >= start.getRoundedTime()
	const ended = now.getRoundedTime() >= end.getRoundedTime()
	const live = started && !ended

	// determine events
	// useDates([start, end], [end]])
	useInterval(1000) // every second
	// useFutureDate(start) // we say how long until it starts
	// useFutureDate(end) // we say how long until it ends
	// usePastDate(end) // we say how long ago it ended
	// useDate(expires)  // we currnently don't do anything with expires

	// determine rendering
	const confidential = Boolean(event.hangoutLink)
	const illustration = confidential
		? '/static/illustrations/undraw_security_o890.svg'
		: '/static/illustrations/undraw_conference_uo36.svg'
	const statusBar = ended ? (
		<Banner title={`Ended ${end.fromNow()}`} status="warning">
			<p>This session has ended.</p>
		</Banner>
	) : live ? (
		<Banner title="Live Now" status="success">
			<p>This session is happening right now! It will end {end.fromNow()}.</p>
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
				title={summary}
				illustration={illustration}
				primaryAction={primaryAction}
				secondaryAction={secondaryAction}
			>
				<p>{description}</p>
			</CalloutCard>
			{statusBar}
		</div>
	)
}
export default ({ events }: { events: RichEventsType }) => {
	return (
		<Layout sectioned={true}>
			{events.map(event => (
				<Layout.Section key={event.id} secondary>
					<Event event={event} />
				</Layout.Section>
			))}
		</Layout>
	)
}
