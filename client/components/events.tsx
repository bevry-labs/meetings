import {
	Layout,
	Banner,
	CalloutCard,
	ComplexAction,
	ProgressBar
} from '@shopify/polaris'
import { RichEventsType, RichEventType } from '../../shared/events'
import { useInterval } from '../hooks'
import Daet from '../../shared/daet'

// Event
const Event = ({ event }: { event: RichEventType }) => {
	const { description, summary, start, end, expires } = event
	const now = new Daet()
	const expired = now.getTime() > expires.getTime()
	const ended = now.getTime() > end.getTime()
	const started = now.getTime() >= start.getTime()
	const active = started && !expired
	const startDelta = start.fromNowDetails()
	const endDelta = end.fromNowDetails()
	const expiresDelta = expires.fromNowDetails()
	let phasePercent
	if (active) {
		const phaseStart = ended ? end : start
		const phaseEnd = ended ? expires : end
		const phaseLength = phaseEnd.getTime() - phaseStart.getTime()
		const phaseProgress = now.getTime() - phaseStart.getTime()
		phasePercent = (phaseProgress / phaseLength) * 100
	}

	// Hooks
	const interval = Math.max(
		Math.min(startDelta.refresh, endDelta.refresh, expiresDelta.refresh),
		1000
	)
	useInterval(interval)

	// Render
	const confidential = Boolean(event.hangoutLink)
	const illustration = confidential
		? '/static/illustrations/undraw_security_o890.svg'
		: '/static/illustrations/undraw_conference_uo36.svg'
	const progressBar =
		phasePercent != null ? (
			<ProgressBar progress={phasePercent} size="small" />
		) : (
			undefined
		)
	const statusBar = expired ? (
		<Banner title={`Expired ${expiresDelta.message}`} status="critical">
			<p>
				You've missed out on this session. Its availability window expired
				earlier.
			</p>
		</Banner>
	) : ended ? (
		<Banner title={`Live ${endDelta.message}`} status="warning">
			<p>We may or may not still be there.</p>
		</Banner>
	) : started ? (
		<Banner title="Live Now" status="success">
			<p>
				This session is happening right now! Come join us! We guarantee
				availability for another {endDelta.message.replace('in ', '')}.
			</p>
		</Banner>
	) : (
		<Banner title={`Live ${startDelta.message}`} status="info">
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
			{progressBar}
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
