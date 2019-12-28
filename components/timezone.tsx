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
	date?: Date
	/** Callback for when the timezone selection changes. */
	onChange?: (value?: { id: string; label: string; offset: number }) => any
	/**
	 * Optional value that can be provided to fully control the component. If not provided,
	 * TimezonePicker will manage state internally.
	 */
	value?: string
	disabled?: boolean
	error?: boolean
	positive?: boolean
}

function dereferenceObjects<T>(timezones: Array<T>) {
	return timezones.slice().map(v => Object.assign({}, v))
}

function buildTimezones(compareDate: Date = new Date()) {
	const timezones = listTimeZones()
		.map(zone => {
			const timezone = findTimeZone(zone)
			const zonedTime = getZonedTime(compareDate, timezone)
			const formatted = formatZonedTime(
				zonedTime,
				`z - [${zone}] ([GMT] Z)`
			).replace('_', ' ')
			return {
				// id: zone,
				value: zone,
				label: formatted,
				offset: zonedTime?.zone?.offset
			}
		})
		// Removes 'noisy' timezones without a letter acronym.
		.filter(option => option.label[0] !== '-' && option.label[0] !== '+')
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

export default function TimezonePicker(props: TimezonePickerPropsT) {
	const [text, setText] = useState(
		props.value ||
			(isBrowser && Intl.DateTimeFormat().resolvedOptions().timeZone) ||
			''
	)
	const [selection, setSelection] = useState([text])
	const timezones = useMemo(() => buildTimezones(props.date), [props.date])
	const options = useMemo(
		function() {
			let options = timezones
			console.log('update timezones')
			if (text !== '') {
				const filterRegex = new RegExp(text, 'i')
				options = options.filter(option => option.label.match(filterRegex))
			}
			// options = dereferenceObjects(options)
			console.log(options)
			return options
		},
		[text]
	)

	function updateSelection(selected: string[]) {
		// console.log('update selection')
		const selectedValue = selected.map(selectedItem => {
			const matchedOption = options.find(option => {
				return option.value.match(selectedItem)
			})
			return matchedOption && matchedOption.label
		})
		setSelection(selected)
		// setText(selectedValue)
	}

	const textField = (
		<Autocomplete.TextField
			onChange={setText}
			label="Timezone"
			value={text}
			// prefix={<Icon source={SearchMinor} color="inkLighter" />}
			placeholder="Search"
		/>
	)

	return (
		<Autocomplete
			options={options}
			selected={selection}
			onSelect={updateSelection}
			textField={textField}
		/>
	)
}
