// Import fetch on server
import fetch from 'fetch-lite'

// Import
import { getEnv } from './env'

export async function setSecret(name: string, value: string): Promise<{}> {
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
		})
	} catch (err) {}

	// create fresh
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify({ name, value }),
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	})
}
