import { Layout, Banner, CalloutCard, ComplexAction } from '@shopify/polaris'
import { RawEventsType, RawEventType } from '../types'
import { useFromNow, useWhen } from '../hooks/moment'
import { Moment, default as moment } from 'moment'

function log(...args: any) {
	console.log(...args)
	return args[0]
}

function getExpired(input: Moment) {
	return log(input.clone().add({ minutes: 1 }), 'getExpired')
}

function hasExpired(input: Moment) {
	return log(moment().isAfter(getExpired(input)), 'hasExpired')
}

function hasntExpired(input: Moment) {
	return log(!hasExpired(input), 'hasntExpired')
}

function firstLine(str?: string): string {
	return (str || '').split(/\s*\n\s*/)[0]
}

const Event = ({ event }: { event: RawEventType }) => {
	// determine dates
	const start = moment(event.start.dateTime)
	const end = moment(event.end.dateTime)
	const now = moment()
	const live = now.isBetween(start, end, 'millisecond', '[]')
	const ended = !now.isBefore(end, 'millisecond') // isBefore/isAfter are exclusive, so use !isBefore to ensure same handled

	// determine events
	console.log('refresh', event.id, {
		live,
		ended,
		useFromNow: useFromNow(start),
		end: useWhen(end),
		expired: useWhen(getExpired(end))
	})

	// determine rendering
	const confidential = Boolean(event.hangoutLink)
	const illustration = confidential
		? '/static/illustrations/undraw_security_o890.svg'
		: '/static/illustrations/undraw_conference_uo36.svg'
	const when = ended ? (
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
export default ({ events }: { events: RawEventsType }) => (
	<Layout sectioned={true}>
		{events
			.filter(
				event => log(hasntExpired(moment(event.end.dateTime))),
				'hasntExpired filter'
			)
			.map(event => (
				<Layout.Section key={event.id} secondary>
					{moment().format()}
					{JSON.stringify(hasntExpired(moment(event.end.dateTime)))}
					<Event event={event} />
				</Layout.Section>
			))}
	</Layout>
)
