import React from 'react'
import {
	Layout,
	Banner,
	CalloutCard,
	ComplexAction,
	ProgressBar
} from '@shopify/polaris'
import { RichEventsType, RichEventType } from '../../shared/events'
import { useInterval, useShift } from '../hooks'
import Daet from '../../shared/daet'
import { podcastJoinUrl, podcastWatchUrl } from '../../shared/config'

// Event
function Event({ event }: { event: RichEventType }) {
	const { description, summary, start, end, expires } = event
	const now = new Daet()
	const cancelled =
		description.toLowerCase().includes('cancelled') ||
		summary.toLowerCase().includes('cancelled')
	const expired = now.getTime() > expires.getTime()
	const ended = now.getTime() > end.getTime()
	const started = now.getTime() >= start.getTime()
	const active = started && !expired && !cancelled
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
	const shift = useShift()

	// Render
	const enabled = active || shift
	const confidential = Boolean(event.hangoutLink)
	const joinUrl = confidential ? event.hangoutLink : podcastJoinUrl
	const watchUrl = confidential ? undefined : podcastWatchUrl
	const illustration = confidential
		? '/static/illustrations/undraw_security_o890.svg'
		: '/static/illustrations/undraw_conference_uo36.svg'
	const progressBar =
		phasePercent != null ? (
			<ProgressBar progress={phasePercent} size="small" />
		) : (
			undefined
		)
	const statusBar = cancelled ? (
		<Banner title={`Cancelled`} status="critical">
			<p>This session has been cancelled. Sorry for the inconvenience.</p>
		</Banner>
	) : expired ? (
		<Banner title={`Expired`} status="critical">
			<p>
				You&apos;ve missed out on this session and are no longer able to
				participate. The availability window ended {expiresDelta.message}.
			</p>
		</Banner>
	) : ended ? (
		<Banner title={`Lingering`} status="warning">
			<p>
				The guaranteed availability window ended {endDelta.message}. If the
				discussion is still ongoing, you may still be able to join, so please
				try.
			</p>
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
	const primaryAction = {
		content: 'Join the call',
		disabled: !enabled,
		url: joinUrl,
		external: true
	} as ComplexAction
	const secondaryAction = confidential
		? undefined
		: ({
				content: 'Watch live',
				disabled: !enabled,
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
function Events({ events }: { events: RichEventsType }) {
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

// Export
export default Events
