import { Layout, Banner, CalloutCard, ComplexAction } from '@shopify/polaris'
import { RichEventsType, RichEventType } from '../../shared/events'
import { useInterval } from '../hooks/time'
import Daet from '../../shared/daet'

// Event
const Event = ({ event }: { event: RichEventType }) => {
	const { description, summary, start, end, expires } = event
	const now = new Daet()
	const started = now.getRoundedTime() >= start.getRoundedTime()
	const ended = now.getRoundedTime() >= end.getRoundedTime()
	const expired = now.getRoundedTime() >= expires.getRoundedTime()
	const active = started && !expired
	const fromNow = expired
		? expires.fromNowDetails()
		: started
		? start.fromNowDetails()
		: end.fromNowDetails()

	// Hooks
	useInterval(fromNow.refresh)

	// Render
	const confidential = Boolean(event.hangoutLink)
	const illustration = confidential
		? '/static/illustrations/undraw_security_o890.svg'
		: '/static/illustrations/undraw_conference_uo36.svg'
	const statusBar = expires ? (
		<Banner title={`Expired ${fromNow.message}`} status="warning">
			<p>The event window has passed.</p>
		</Banner>
	) : ended ? (
		<Banner title={`Live ${fromNow.message}`} status="warning">
			<p>
				The initial availibility window has passed. Discussion may or may not be
				ongoing.
			</p>
		</Banner>
	) : started ? (
		<Banner title="Live Now" status="success">
			<p>This session is happening right now! It will end {fromNow.message}.</p>
		</Banner>
	) : (
		<Banner title={`Live ${fromNow.message}`} status="info">
			<p>Join us {start.calendar()} your time.</p>
		</Banner>
	)
	const joinUrl = event.hangoutLink
	const watchUrl = confidential ? undefined : '/youtube'
	const primaryAction = {
		content: 'Join the call',
		disabled: !active,
		url: joinUrl,
		external: true
	} as ComplexAction
	const secondaryAction = confidential
		? undefined
		: ({
				content: 'Watch live',
				disabled: !active,
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

// Events
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
