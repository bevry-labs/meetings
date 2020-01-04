// External
import React from 'react'

// Polaris
import { InlineError } from '@shopify/polaris'
import { errors } from 'faunadb'

export default function useErrors<
	Errors extends { [key: string]: { message?: string } },
	Field extends keyof Errors
>(fields: Set<Field>, errors: Errors) {
	const shownErrors: Set<Field> = new Set()
	function showError(name: Field): string | undefined {
		shownErrors.add(name)
		const error = errors[name]
		if (error) {
			return error.message || `${name} is invalid`
		} else if (fields.has(name) === false) {
			throw new Error('unknown field provided to show error: ' + name)
		}
	}
	function renderError(name: Field, unique = false) {
		const message = showError(name)
		if (message) {
			return (
				<InlineError
					key={name as string}
					message={message}
					fieldID={name as string}
				></InlineError>
			)
		}
		return null
	}
	function showErrors(names: Set<Field> = fields, all = false, check = true) {
		const remaining = []
		const render = []
		for (const name of fields) {
			if (names.has(name)) {
				render.push(renderError(name))
			} else if (shownErrors.has(name) === false) {
				remaining.push(name)
			} else if (all) {
				render.push(renderError(name))
			}
		}
		if (remaining.length) {
			throw new Error(
				'some errors were never checked for:\n' + remaining.join('\n')
			)
		}
		return render
	}

	return { showError, showErrors }
}
