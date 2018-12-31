// Import fetch on server
import * as fetchImport from 'isomorphic-unfetch'
const fetch = (fetchImport.default || fetchImport) as typeof fetchImport.default

// Import
import { getEnv } from './env'

export async function setSecret(name: string, value: string) {
	const team = getEnv('ZEIT_TEAM')
	const token = getEnv('ZEIT_TOKEN')
	const url = `https://api.zeit.co/v2/now/secrets/${name}?teamId=${team}`

	// delete if already exists
	try {
		await fetch(url, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(response => response.json())
	} catch (err) {}

	// create fresh
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify({ name, value }),
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}).then(response => response.json())
}
