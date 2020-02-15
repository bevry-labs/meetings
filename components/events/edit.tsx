// External
import React, { useState, useEffect } from 'react'

// External
import Router from 'next/router'
import { useForm } from 'react-hook-form'
import Daet from 'daet'

// Polaris
import {
	Layout,
	PageActions,
	Form,
	FormLayout,
	Toast,
	TextField,
	RadioButton,
	Stack
} from '@shopify/polaris'

// Internal
import { addEventSchema, AddEventSchema } from '../../shared/schemas'
import { getLocalISOString, getTimezone } from '../../shared/util'
import useErrors from '../../shared/errors'
import TimezonePicker from '../../components/timezone'

// Types
type Status = { success: null } | { success: boolean; message: string }

// Page
export default function EditEvent() {
	const now = new Daet()

	// Field validation
	const form = useForm<AddEventSchema>({
		validationSchema: addEventSchema,
		defaultValues: {
			start: now.raw,
			finish: now.plus(30, 'minute').raw,
			expiry: now.plus(2.5, 'hour').raw,
			privacy: 'public',
			tz: getTimezone()
		}
	})
	useEffect(() => {
		form.register({ name: 'title' })
		form.register({ name: 'description' })
		form.register({ name: 'start' })
		form.register({ name: 'finish' })
		form.register({ name: 'expiry' })
		form.register({ name: 'tz' })
		form.register({ name: 'privacy' })
		form.register({ name: 'joinURL' })
		form.register({ name: 'watchURL' })
	}, [form.register])
	const values = form.watch()

	// Error handling
	const { showError, showErrors } = useErrors(
		// @ts-ignore
		new Set(addEventSchema._nodes),
		form.errors
	)

	// Timezone
	// const [timezone, setTimezone] = useState(
	// 	Intl.DateTimeFormat().resolvedOptions().timeZone
	// )

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
	async function onSubmit({
		title,
		description,
		start,
		finish,
		expiry,
		tz,
		privacy,
		joinURL,
		watchURL
	}: AddEventSchema) {
		const url = '/api/events/add'
		const event: AddEventSchema = {
			title,
			description,
			start,
			finish,
			expiry,
			cancelled: false,
			tz,
			privacy,
			joinURL,
			watchURL
		}
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
		if (res.status !== 201) {
			throw new Error(`Server returned failure code ${res.status}`)
		}
		setStatus({ success: true, message: 'Event created' })
		// const data = await res.json()
	}

	return (
		<>
			<Layout.Section>
				<Form onSubmit={form.handleSubmit(onSubmit)}>
					<FormLayout>
						<TextField
							value={values.title}
							name="title"
							label="Event Title"
							type="text"
							onChange={value => form.setValue('title', value, true)}
							error={showError('title')}
							helpText={<span>Your event will have this name.</span>}
						/>
						<TextField
							value={values.description}
							name="description"
							label="Description"
							type="text"
							onChange={value => form.setValue('description', value, true)}
							error={showError('description')}
							helpText={<span>Description of this event.</span>}
						/>
						<TextField
							value={getLocalISOString(values.start)}
							name="start"
							label="When will the guaranteed availability for the event begin?"
							type="datetime-local"
							onChange={value => form.setValue('start', new Date(value), true)}
							error={showError('start')}
						/>
						<TextField
							value={getLocalISOString(values.finish)}
							name="finish"
							label="When will the guaranteed availability for the event finish?"
							type="datetime-local"
							onChange={value => form.setValue('finish', new Date(value), true)}
							error={showError('finish')}
						/>
						<TextField
							value={getLocalISOString(values.expiry)}
							name="expiry"
							label="When will the event be completely over and doors closed?"
							type="datetime-local"
							onChange={value => form.setValue('expiry', new Date(value), true)}
							error={showError('expiry')}
						/>
						{/* @todo show the start, finish, and expiry in a nice fashion to the local timezone */}
						<TimezonePicker
							when={values.start}
							value={values.tz}
							onChange={value => {
								console.log('timezone:', value)
								form.setValue('tz', (value && value.value) || '', true)
							}}
						/>
						<TextField
							value={values.joinURL}
							name="joinURL"
							label="The URL to join and participate in the event"
							type="text"
							onChange={value => form.setValue('joinURL', value, true)}
							error={showError('joinURL')}
							clearButton={true}
							onClearButtonClick={id => form.setValue('joinURL', '', true)}
						/>
						<TextField
							value={values.watchURL}
							name="watchURL"
							label="The URL to watch the event"
							type="url"
							onChange={value => form.setValue('watchURL', value, true)}
							error={showError('watchURL')}
							clearButton={true}
							onClearButtonClick={id => form.setValue('watchURL', '', true)}
						/>
						<Stack vertical>
							<RadioButton
								label="Make Event Public"
								helpText="Anyone will be able to join and watch the event."
								checked={values.privacy === 'public'}
								name="privacy"
								onChange={value => form.setValue('privacy', 'public', true)}
							/>
							<RadioButton
								label="Make Event Protected"
								helpText="Anyone will be able to watch the event, only specified members will be able to participate."
								name="privacy"
								checked={values.privacy === 'protected'}
								onChange={value => form.setValue('privacy', 'protected', true)}
							/>
							<RadioButton
								label="Make Event Private"
								helpText="Only specified members will be able to watch and participate."
								name="privacy"
								checked={values.privacy === 'private'}
								onChange={value => form.setValue('privacy', 'private', true)}
							/>
						</Stack>
						{showErrors(new Set(['privacy', 'tz', 'cancelled']), true)}
						<PageActions
							// @ts-ignore
							primaryAction={{
								content: 'Save',
								onAction: form.handleSubmit(onSubmit)
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
		</>
	)
}
