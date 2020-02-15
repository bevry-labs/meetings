/*
Based off of
Copyright (c) 2018-2019 Uber Technologies, Inc.
https://raw.githubusercontent.com/uber/baseweb/88e3ce63954e49bc4b493ddc17be1475bd211c59/src/timezonepicker/timezone-picker.js
https://raw.githubusercontent.com/uber/baseweb/88e3ce63954e49bc4b493ddc17be1475bd211c59/LICENSE
*/
import React, { useState, useMemo, useCallback } from 'react'
import {
	findTimeZone,
	getZonedTime,
	listTimeZones
} from 'timezone-support/dist/index-1900-2050.js'
import { formatZonedTime } from 'timezone-support/dist/parse-format.js'
import { Autocomplete } from '@shopify/polaris'

import { isBrowser } from '../shared/config'

export type TimezonePickerStateT = {
	/** List of timezones from the IANA database. */
	timezones: string[]
	/** Value provided to the select component. */
	value?: string
}
export type TimezonePickerPropsT = {
	/**
	 * If not provided, defaults to new Date(). Important to note that the timezone picker only
	 * displays options related to the provided date. Take Pacific Time for example. On March 9th,
	 * Pacific Time equates to the more specific Pacific Standard Time. On March 10th, it operates on
	 * Pacific Daylight Time. The timezone picker will never display PST and PDT together. If you need
	 * exact specificity, provide a date. Otherwise it will default to the relevant timezone at render.
	 */
	when?: Date
	/** Callback for when the timezone selection changes. */
	onChange: (value: Option | undefined) => any
	/**
	 * Optional value that can be provided to fully control the component. If not provided,
	 * TimezonePicker will manage state internally.
	 */
	value?: string
	disabled?: boolean
	error?: boolean
	positive?: boolean
}

interface Option {
	value: string
	label: string
	name: string
	abbreviation: string
	offset: number
}

function dereferenceObjects<T>(timezones: Array<T>) {
	return timezones.slice().map(v => Object.assign({}, v))
}

function humanify(str: string | undefined) {
	return str ? str.replace(/_/g, ' ') : ''
}
function robotify(str: string | undefined) {
	return str ? str.replace(/\s/g, '_') : ''
}

function buildTimezoneOption(when: Date = new Date(), input: string): Option {
	const timezone = findTimeZone(input)
	const zonedTime = getZonedTime(when, timezone)
	const { zone } = zonedTime
	if (!zone)
		return {
			value: '',
			label: '',
			name: '',
			abbreviation: '',
			offset: 0
		}
	const value = humanify(timezone.name)
	const label = humanify(
		formatZonedTime(zonedTime, `z - [${timezone.name}] ([GMT] Z)`)
	)
	const option = {
		value,
		label,
		name: timezone.name,
		abbreviation: zone.abbreviation || '',
		offset: zone.offset
	}
	return option
}

function buildTimezones(when: Date = new Date()): Array<Option> {
	const timezones = listTimeZones()
		.map(buildTimezoneOption.bind(null, when))
		// Removes 'noisy' timezones without a letter acronym.
		.filter(
			option =>
				option.label && option.label[0] !== '-' && option.label[0] !== '+'
		)
		// Sorts W -> E, prioritizes america. could be more nuanced based on system tz but simple for now
		.sort((a, b) => {
			// @ts-ignore
			const offsetDelta = b.offset - a.offset
			if (offsetDelta !== 0) return offsetDelta
			if (a.label < b.label) return -1
			if (a.label > b.label) return 1
			return 0
		})
	return timezones
}

function findTimezoneOptions(options: Array<Option>, input: string) {
	return options.filter(option =>
		option.label.toUpperCase().includes(input.toUpperCase())
	)
}

function findTimezoneOption(options: Array<Option>, input: string) {
	if (!input) return
	const option = options.find(option => option.value === input)
	if (option) return option
	const many = findTimezoneOptions(options, input)
	if (many.length === 1) return many[0]
}

function optionEqual(a: Option | undefined, b: Option | undefined) {
	if (a && b) {
		return a.abbreviation === b.abbreviation && a.offset === b.offset
	}
	return a === b
}

export default function TimezonePicker(props: TimezonePickerPropsT) {
	// Prepare
	const when = props.when?.toISOString()

	// Set the input
	const [input, setInput] = useState(
		props.value ||
			(isBrowser && Intl.DateTimeFormat().resolvedOptions().timeZone) ||
			''
	)

	// Filter timezones based on date
	const timezones = useMemo(() => buildTimezones(props.when), [when])

	// Filter options based on input
	const options = useMemo(
		function() {
			let options = timezones
			if (input !== '') {
				options = findTimezoneOptions(options, input)
			}
			// workaround for https://github.com/Shopify/polaris-react/pull/2582
			options = dereferenceObjects(options)
			return options
		},
		[input, when]
	)

	// Set the value
	// Currently affected by this bug https://github.com/Shopify/polaris-react/issues/2750
	const [value, setValue] = useState<Option>()
	const option = findTimezoneOption(options, input)
	if (optionEqual(option, value) === false) {
		props.onChange(option)
		setValue(option)
	}

	// Update the selection
	function updateSelection(selectedItems: string[]) {
		const option = findTimezoneOption(options, selectedItems[0])
		if (option) {
			setInput(option.value)
		}
	}

	const textField = (
		<Autocomplete.TextField
			onChange={setInput}
			label="Timezone"
			value={input}
			// prefix={<Icon source={SearchMinor} color="inkLighter" />}
			placeholder="Search"
		/>
	)

	console.log(options)
	return (
		<Autocomplete
			options={options}
			selected={[value?.value || '']}
			onSelect={updateSelection}
			textField={textField}
		/>
	)
}
