import React, { useState } from 'react'
import {
	Layout,
	Banner,
	CalloutCard,
	ComplexAction,
	ProgressBar
} from '@shopify/polaris'

import { useInterval, useMetaKey } from '@bevry/hooks'
import Daet from 'daet'

import { RichEventSchema, Privacy } from '../../shared/schemas'
import { privacyIllustrations } from '../../shared/config'

// Event
function Event({ event }: { event: RichEventSchema }) {
	// Prepare
	const now = new Daet()
	const start = new Daet(event.start)
	const finish = new Daet(event.finish)
	const expiry = new Daet(event.expiry)
	// Detect
	const cancelled =
		event.cancelled ||
		event.title.toLowerCase().includes('cancelled') ||
		event.description.toLowerCase().includes('cancelled')
	const expired = now.getTime() > expiry.getTime()
	const finished = now.getTime() > finish.getTime()
	const started = now.getTime() >= start.getTime()
	const active = started && !expired && !cancelled
	const startDelta = start.fromNowDetails()
	const endDelta = finish.fromNowDetails()
	const expiresDelta = expiry.fromNowDetails()
	let phasePercent
	if (active) {
		const phaseStart = finished ? finish : start
		const phaseFinish = finished ? expiry : finish
		const phaseLength = phaseFinish.getTime() - phaseStart.getTime()
		const phaseProgress = now.getTime() - phaseStart.getTime()
		phasePercent = (phaseProgress / phaseLength) * 100
	}

	// Hooks
	const [forceEnable, setForceEnable] = useState()
	useInterval(
		[startDelta.refresh, endDelta.refresh, expiresDelta.refresh],
		1000
	)
	useMetaKey(active => setForceEnable(active))

	// Render
	const enabled = active || forceEnable
	const illustration = privacyIllustrations[event.privacy as Privacy]
	const progressBar =
		phasePercent != null ? (
			<ProgressBar progress={phasePercent} size="small" />
		) : (
			undefined
		)
	const statusBar = cancelled ? (
		<Banner title={`Cancelled`} status="critical">
			<p>
				The session at {start.calendar()} has been cancelled. This likely
				happened because none of the hosts were available. Sorry for the
				inconvenience.
			</p>
		</Banner>
	) : expired ? (
		<Banner title={`Expired`} status="critical">
			<p>
				You&apos;ve missed out on this session and are no longer able to
				participate. The availability window ended {expiresDelta.message}.
			</p>
		</Banner>
	) : finished ? (
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
				This session is happening right now! Come join us! We guarantee access
				for another {endDelta.message.replace('in ', '')}.
			</p>
		</Banner>
	) : (
		<Banner title={`Live ${startDelta.message}`} status="info">
			<p>Join us {start.calendar()} your time.</p>
		</Banner>
	)
	const joinAction = !event.joinURL
		? undefined
		: ({
				content: 'Join the call',
				disabled: !enabled,
				url: event.joinURL,
				external: true
		  } as ComplexAction)
	const watchAction = !event.watchURL
		? undefined
		: ({
				content: 'Watch live',
				disabled: !enabled,
				url: event.watchURL,
				external: true
		  } as ComplexAction)
	const noAction = {
		content: 'N/A'
	} as ComplexAction
	const actions = [joinAction, watchAction].filter(i => i != null)
	return (
		<div>
			<CalloutCard
				title={event.title}
				illustration={illustration}
				primaryAction={actions[0] || noAction}
				secondaryAction={actions[1] || undefined}
			>
				<p>{event.description}</p>
			</CalloutCard>
			{statusBar}
			{progressBar}
		</div>
	)
}

// Events
function Events({ events }: { events: RichEventSchema[] }) {
	return (
		<Layout sectioned={true}>
			{events.map(event => (
				<Layout.Section key={event.id as string} secondary>
					<Event event={event} />
				</Layout.Section>
			))}
		</Layout>
	)
}

// Export
export default Events
