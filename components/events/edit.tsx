// External
import React, { useState, useEffect, useCallback } from 'react'
import Router from 'next/router'
import Errlop from 'errlop'
import { useForm, FieldError } from 'react-hook-form'
import TimezonePicker from '../../components/timezone'

// Polaris
import {
	Layout,
	PageActions,
	Form,
	FormLayout,
	Toast,
	TextField,
	RadioButton,
	Stack,
	RangeSlider
} from '@shopify/polaris'

// Internal
import Page from '../../components/page'
import { addEventSchema, AddEventSchema } from '../../shared/schemas'
import { getLocalISOString } from '../../shared/util'
import Daet from 'daet'

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
export default function EditEvent() {
	const now = new Daet()

	// Field validation
	const { register, setValue, watch, handleSubmit, errors } = useForm<
		AddEventSchema
	>({
		validationSchema: addEventSchema,
		defaultValues: {
			start: now.raw,
			finish: now.plus(30, 'minute').raw,
			expiry: now.plus(2.5, 'hour').raw
		}
	})
	useEffect(() => {
		register({ name: 'title' })
		register({ name: 'description' })
		register({ name: 'start' })
		register({ name: 'finish' })
		register({ name: 'expiry' })
		register({ name: 'tz' })
		register({ name: 'privacy' })
		register({ name: 'joinURL' })
		register({ name: 'watchURL' })
	}, [register])
	const {
		title,
		description,
		start,
		finish,
		expiry,
		tz,
		privacy,
		joinURL,
		watchURL
	} = watch()

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
		debugger
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
				<Form onSubmit={handleSubmit(onSubmit)}>
					<FormLayout>
						<TextField
							value={title}
							name="title"
							label="Event Title"
							type="text"
							onChange={value => setValue('title', value, true)}
							error={error(errors.title)}
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
							label="When will the guaranteed availability for the event begin?"
							type="datetime-local"
							onChange={value => setValue('start', new Date(value), true)}
							error={error(errors.start)}
						/>
						<TextField
							value={getLocalISOString(finish)}
							name="finish"
							label="When will the guaranteed availability for the event finish?"
							type="datetime-local"
							onChange={value => setValue('finish', new Date(value), true)}
							error={error(errors.finish)}
						/>
						<TextField
							value={getLocalISOString(expiry)}
							name="expiry"
							label="When will the event be completely over and doors closed?"
							type="datetime-local"
							onChange={value => setValue('expiry', new Date(value), true)}
							error={error(errors.finish)}
						/>
						<TimezonePicker
							date={start}
							value={tz}
							onChange={value =>
								setValue('tz', (value && value.id) || '', true)
							}
						/>
						{/* @todo show the start, finish, and expiry in a nice fashion to the local timezone */}
						<TextField
							value={joinURL}
							name="joinURL"
							label="The URL to join and participate in the event"
							type="text"
							onChange={value => setValue('joinURL', value, true)}
							error={error(errors.joinURL)}
							clearButton={true}
							onClearButtonClick={id => setValue('joinURL', '', true)}
						/>
						<TextField
							value={watchURL}
							name="watchURL"
							label="The URL to watch the event"
							type="url"
							onChange={value => setValue('watchURL', value, true)}
							error={error(errors.watchURL)}
							clearButton={true}
							onClearButtonClick={id => setValue('watchURL', '', true)}
						/>
						<Stack vertical>
							<RadioButton
								label="Make Event Public"
								helpText="Anyone will be able to join and watch the event."
								checked={privacy === 'public'}
								id="disabled"
								name="accounts"
								onChange={value => setValue('privacy', 'public', true)}
							/>
							<RadioButton
								label="Make Event Protected"
								helpText="Anyone will be able to watch the event, only specified members will be able to participate."
								id="optional"
								name="accounts"
								checked={privacy === 'protected'}
								onChange={value => setValue('privacy', 'protected', true)}
							/>
							<RadioButton
								label="Make Event Private"
								helpText="Only specified members will be able to watch and participate."
								id="optional"
								name="accounts"
								checked={privacy === 'private'}
								onChange={value => setValue('privacy', 'private', true)}
							/>
						</Stack>
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
		</>
	)
}
