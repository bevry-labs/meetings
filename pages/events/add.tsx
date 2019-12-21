// External
import React, { useState, useEffect, useCallback } from 'react'
import Router from 'next/router'
import Errlop from 'errlop'

// Polaris
import {
	DisplayText,
	Layout,
	Button,
	PageActions,
	Checkbox,
	Form,
	FormLayout,
	Toast,
	TextField
} from '@shopify/polaris'

// Internal
import Page from '../../components/page'

// Types
type Status = { success: null } | { success: boolean; message: string }

// Page
function AddEventPage({ hostname }: { hostname: string }) {
	const now = new Date().toISOString()
	const [eventName, setEventName] = useState('')
	const [eventDesc, setEventDesc] = useState('')
	/* Use default so that use has something to work with and dont have to
	   type this really long date string. */
	const [startTime, setStartTime] = useState(now)
	const [endTime, setEndTime] = useState(now)
	const [status, setStatus] = useState<Status>({ success: null })
	const toast =
		status.success == null ? null : status.success ? (
			<Toast content={status.message} onDismiss={() => Router.push('/')} />
		) : (
			<Toast
				error
				content={status.message}
				onDismiss={() => setStatus({ success: null })}
			/>
		)
	const handleSubmit = useCallback(
		async function() {
			try {
				const event = {
					summary: eventName,
					description: eventDesc,
					start: { dateTime: startTime },
					end: { dateTime: endTime }
				}
				const url = hostname + '/api/events/add'
				const res = await fetch(url, {
					method: 'POST', // *GET, POST, PUT, DELETE, etc.
					mode: 'same-origin', // no-cors, *cors, same-origin
					cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
					credentials: 'same-origin', // include, *same-origin, omit
					headers: {
						'Content-Type': 'application/json'
						// 'Content-Type': 'application/x-www-form-urlencoded',
					},
					redirect: 'follow', // manual, *follow, error
					// referrerPolicy: 'no-referrer', // no-referrer, *client
					body: JSON.stringify(event) // body data type must match "Content-Type" header
				})
				if (res.status !== 201)
					throw new Error(`Server returned failure code ${res.status}`)
				setStatus({ success: true, message: 'Event created' })
				// const data = await res.json()
			} catch (err) {
				console.error(err)
				const message = 'Failed to create the event'
				setStatus({ success: false, message })
			}
		},
		[hostname, eventName, eventDesc, startTime, endTime]
	)

	/* TODO: Input needs to be checked. Name/Desc should not be empty and date time picker we     use will take care of date/time validation. */
	return (
		<Page>
			<Layout.Section>
				<Form onSubmit={handleSubmit}>
					<FormLayout>
						<TextField
							value={eventName}
							onChange={value => setEventName(value)}
							label="Event Name"
							type="text"
							helpText={<span>Your event will have this name.</span>}
						/>
						<TextField
							value={eventDesc}
							onChange={value => setEventDesc(value)}
							label="Description"
							type="text"
							helpText={<span>Description of this event.</span>}
						/>
						<TextField
							value={startTime}
							onChange={value => setStartTime(value)}
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
							onChange={value => setEndTime(value)}
							label="End Time"
							type="text"
							helpText={
								<span>
									End Time of the event in YYYY-MM-DDTHH:MMSS.000Z format{' '}
								</span>
							}
						/>
						<PageActions
							primaryAction={{
								content: 'Save',
								onAction: handleSubmit
							}}
							secondaryActions={[
								{
									content: 'Discard',
									destructive: true,
									onAction() {
										Router.back()
									}
								}
							]}
						/>
					</FormLayout>
				</Form>
			</Layout.Section>
		</Page>
	)
}
