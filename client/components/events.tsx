import { Layout, Banner, CalloutCard, ComplexAction } from '@shopify/polaris'
import { RichEventsType, RichEventType } from '../../types'
import { useFutureDate, usePastDate } from '../hooks/moment'
import moment from 'moment'

function log(prefix: string) {
	console.log([
		prefix,
		moment()
			.add({ seconds: 3 })
			.fromNow(),
		moment()
			.add({ seconds: 7 })
			.fromNow(),
		moment()
			.add({ seconds: 13 })
			.fromNow()
	])
}
function attempt(s: number, ss: number) {
	moment.relativeTimeThreshold('s', s)
	moment.relativeTimeThreshold('ss', ss)
	log(`s=${s}, ss=${ss}`)
	moment.relativeTimeThreshold('ss', ss)
	moment.relativeTimeThreshold('s', s)
	log(`ss=${ss}, s=${s}`)
}

attempt(-1, 5)

/*
moment.updateLocale('en', {
	relativeTime: {
		future: 'in %s',
		past: '%s ago',
		s: 'a few seconds',
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
})*/

const Event = ({ event }: { event: RichEventType }) => {
	// determine dates
	const { description, summary, start, end, expires } = event
	const now = moment()
	const started = now.isSameOrAfter(start)
	const ended = now.isSameOrAfter(end, 'minute')
	const live = started && !ended

	// determine events
	// useDates([start, end], [end]])
	useFutureDate(start) // we say how long until it starts
	useFutureDate(end) // we say how long until it ends
	usePastDate(end) // we say how long ago it ended
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
