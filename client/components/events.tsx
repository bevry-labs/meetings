import { Layout, Banner, CalloutCard, ComplexAction } from '@shopify/polaris'
import { RichEventsType, RichEventType } from '../../types'
import { useFromNow, useWhen } from '../hooks/moment'
import moment from 'moment'

moment.updateLocale('en', {
	relativeTime: {
		future: 'in %s',
		past: '%s ago',
		s: '%d seconds',
		ss: '%d seconds',
		m: 'a minute',
		mm: '%d minutes',
		h: 'an hour',
		hh: '%d hours',
		d: 'a day',
		dd: '%d days',
		M: 'a month',
		MM: '%d months',
		y: 'a year',
		yy: '%d years'
	}
})

const Event = ({ event }: { event: RichEventType }) => {
	// determine dates
	const { description, summary, start, end, expires } = event
	const now = moment()
	const started = now.isSameOrAfter(start)
	const ended = !now.isBefore(end, 'minute') // isBefore/isAfter are exclusive, so use !isBefore to ensure same handled
	const live = started && !ended

	// determine events
	useFromNow(start)
	useWhen(end, expires)

	// determine rendering
	const confidential = Boolean(event.hangoutLink)
	const illustration = confidential
		? '/static/illustrations/undraw_security_o890.svg'
		: '/static/illustrations/undraw_conference_uo36.svg'
	const statusBar = ended ? (
		<Banner title={`Live ${start.fromNow()}`} status="warning">
			<p>Session has just ended.</p>
		</Banner>
	) : live ? (
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
