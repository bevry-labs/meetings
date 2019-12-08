import React, { useState, useEffect, useCallback } from 'react'
import Page from '../client/components/page'

// Polaris
import {
	DisplayText,
	Layout,
	Button,
	Checkbox,
	Form,
	FormLayout,
	TextField
} from '@shopify/polaris'

// Events
import Events from '../client/components/events'
import { IndexProps, RichEventType, RichEventsType } from '../shared/types'
import { fetchRawEvents, enrichEvents, fetchRawEventDb } from '../client/events'
import { IncomingMessage } from 'http'

import Daet from 'daet'

let hostname: string = ''
let enableFauna: boolean = false

function AddNewEventForum() {
	const now = new Daet()
	const [eventName, setEventName] = useState('')
	const [eventDesc, setEventDesc] = useState('')
	/* Use default so that use has something to work with and dont have to
	   type this really long date string. */
	const [startTime, setStartTime] = useState(now.toISOString())
	const [endTime, setEndTime] = useState(now.toISOString())

	const handleSubmit = useCallback(
		_event => {
			const req = new XMLHttpRequest()
			req.onreadystatechange = () => {
				if (req.readyState === 4) {
					console.log('Submit status: ' + req.status)
					if (req.status !== 200 && req.status !== 201) {
						alert(
							'Failed to create the event (ERROR:' +
								req.statusText +
								'), try again!'
						)
					} else {
						/* TODO: For now just let the user know by a alert pop-up, but we could come up with
						 * something better from shopify. */
						alert(
							'Successfully created the event, please refresh the page to see it'
						)
					}
				}
			}
			req.open('POST', hostname + '/api/submit', true)
			req.setRequestHeader('Content-Type', 'application/json')
			req.send(
				JSON.stringify({
					summary: eventName,
					description: eventDesc,
					start: { dateTime: startTime },
					end: { dateTime: endTime }
				})
			)
			setEventName('')
			setEventDesc('')
		},
		[hostname, eventName, eventDesc, startTime, endTime]
	)

	/* TODO: Input needs to be checked. Name/Desc should not be empty and date time picker we use
	 * will take care of date/time validation. */
	const handleEventNameChange = useCallback(value => setEventName(value), [])
	const handleEventDescChange = useCallback(value => setEventDesc(value), [])
	const handleStartTimeChange = useCallback(value => setStartTime(value), [])
	const handleEndTimeChange = useCallback(value => setEndTime(value), [])

	return (
		<Form onSubmit={handleSubmit}>
			<FormLayout>
				<TextField
					value={eventName}
					onChange={handleEventNameChange}
					label="Event Name"
					type="text"
					helpText={<span>Your event will have this name.</span>}
				/>
				<TextField
					value={eventDesc}
					onChange={handleEventDescChange}
					label="Description"
					type="text"
					helpText={<span>Description of this event.</span>}
				/>
				<TextField
					value={startTime}
					onChange={handleStartTimeChange}
					label="Start Time"
					type="text"
					helpText={
						<span>
							Start Time of the event in YYYY-MM-DDTHH:MMSS.000Z format{' '}
						</span>
					}
				/>
				<TextField
					value={endTime}
					onChange={handleEndTimeChange}
					label="End Time"
					type="text"
					helpText={
						<span>
							End Time of the event in YYYY-MM-DDTHH:MMSS.000Z format{' '}
						</span>
					}
				/>
				<Button submit>Submit</Button>
			</FormLayout>
		</Form>
	)
}

// Page
function IndexPage({ rawEvents }: IndexProps) {
	/* TODO: Implement Effect for getting events from fauna.
	const [events, setEvents] = useState<RichEventsType>([])
	useEffect(() => {
		async function getEvents() {
			const rawEvents = await fetchRawEventDb({dbname: 'posts'})
			const events = enrichEvents(rawEvents)
			setEvents(events);
		}
	}, [])
	*/
	const events = enrichEvents(rawEvents)
	return (
		<Page>
			<Layout.Section>
				<DisplayText size="small">
					Take part in <a href="https://bevry.me">Bevry</a>&apos;s{' '}
					<a href="https://bevry.me/meetings/">meetings</a>.
				</DisplayText>
			</Layout.Section>
			{events.length ? <Events events={events} /> : ''}
			<Layout.Section>
				{enableFauna ? <AddNewEventForum /> : ''}
			</Layout.Section>
		</Page>
	)
}

// Fetch

IndexPage.getInitialProps = function({
	req
}: {
	req: IncomingMessage
}): Promise<IndexProps> {
	// compat for dev and prod
	const host = req.headers.host || ''
	hostname = host
		? host.startsWith('localhost')
			? `http://${host}`
			: `https://${host}`
		: 'https://meet.bevry.me/api/events'
	if (enableFauna)
	{
		return fetchRawEventDb({ dbname: 'posts' }).then(rawEvents => ({
			rawEvents
		}))
	} else {
		return fetchRawEvents({ hostname }).then(rawEvents => ({
			rawEvents
		}))
	}
}

// Export
export default IndexPage
