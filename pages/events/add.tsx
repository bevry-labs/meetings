// External
import React, { useState, useEffect, useCallback } from 'react'
import Router from 'next/router'
import Errlop from 'errlop'
import { useForm, FieldError } from 'react-hook-form'
import TimezonePicker from '../../components/timezone'

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
import { addSchema, AddSchema } from '../../shared/schemas'
import { getLocalISOString } from '../../shared/util'

// Types
type Status = { success: null } | { success: boolean; message: string }
function error(err: FieldError | any | undefined): string | undefined {
	if (err) {
		if (err.message) {
			return err.message
		}
		return 'invalid'
	}
}

// Page
export default function AddEventPage() {
	const now = new Date()

	// Field validation
	const { register, setValue, watch, handleSubmit, errors } = useForm<
		AddSchema
	>({
		validationSchema: addSchema,
		defaultValues: {
			start: now,
			end: now
		}
	})
	useEffect(() => {
		register({ name: 'name' })
		register({ name: 'description' })
		register({ name: 'start' })
		register({ name: 'end' })
	}, [register])
	const { name, description, start, end } = watch()

	// Timezone
	const [timezone, setTimezone] = useState(
		Intl.DateTimeFormat().resolvedOptions().timeZone
	)

	// Submit validation
	const [status, setStatus] = useState<Status>({ success: null })
	const toast =
		status.success == null ? (
			''
		) : status.success ? (
			<Toast content={status.message} onDismiss={() => Router.push('/')} />
		) : (
			<Toast
				error
				content={status.message}
				onDismiss={() => setStatus({ success: null })}
			/>
		)
	async function onSubmit({ name, description, start, end }: AddSchema) {
		const url = '/api/events/add'
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
			body: JSON.stringify({ name, description, start, end }) // body data type must match "Content-Type" header
		})
		if (res.status !== 201) {
			throw new Error(`Server returned failure code ${res.status}`)
		}
		setStatus({ success: true, message: 'Event created' })
		// const data = await res.json()
	}

	/* TODO: Input needs to be checked. Name/Desc should not be empty and date time picker we     use will take care of date/time validation. */
	return (
		<Page>
			<Layout.Section>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<FormLayout>
						<TextField
							value={name}
							name="name"
							label="Event Name"
							type="text"
							onChange={value => setValue('name', value, true)}
							// clearButton={true}
							// onClearButtonClick={(id: string) =>
							// 	setEventName({ ...eventName, val: '' })
							// }
							error={error(errors.name)}
							helpText={<span>Your event will have this name.</span>}
						/>
						<TextField
							value={description}
							name="description"
							label="Description"
							type="text"
							onChange={value => setValue('description', value, true)}
							error={error(errors.description)}
							helpText={<span>Description of this event.</span>}
						/>
						<TextField
							value={getLocalISOString(start)}
							name="start"
							label="Start Time"
							type="datetime-local"
							onChange={value => setValue('start', new Date(value), true)}
							error={error(errors.start)}
						/>
						<TextField
							value={getLocalISOString(end)}
							name="end"
							label="End Time"
							type="datetime-local"
							onChange={value => setValue('end', new Date(value), true)}
							error={error(errors.end)}
						/>

						<TimezonePicker date={start} />

						<PageActions
							// @ts-ignore
							primaryAction={{
								content: 'Save',
								onAction: handleSubmit(onSubmit)
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
			{toast}
		</Page>
	)
}
