/* eslint camelcase:0 */

// Import
import { google } from 'googleapis'

// Prepare
const calendarId =
	'bevry.me_qeq66am9eji1bcll7ntrn3u830@group.calendar.google.com'

// Scopes
const scopes = [
	// View events on all your calendars
	'https://www.googleapis.com/auth/calendar.events.readonly',
	// View your calendars
	'https://www.googleapis.com/auth/calendar.readonly',
	// View your Calendar settings
	'https://www.googleapis.com/auth/calendar.settings.readonly'
]

interface GoogleCredentials {
	type: string
	project_id: string
	private_key_id: string
	private_key: string
	client_email: string
	client_id: string
	auth_uri: string
	token_uri: string
	auth_provider_x509_cert_url: string
	client_x509_cert_url: string
}

const env = process.env.GOOGLE_CREDENTIALS
if (!env)
	throw new Error(
		'Google Credentials was not found: ' +
			JSON.stringify(process.env, null, '  ')
	)
const credentials: GoogleCredentials = JSON.parse(
	Buffer.from(env, 'base64').toString('ascii')
)

export function getAuth() {
	return google.auth.getClient({
		credentials,
		scopes,
		projectId: credentials.project_id
	})
}

export async function getCalendar() {
	const auth = await getAuth()
	return google.calendar({ version: 'v3', auth })
}

export async function getEvents(start: string, finish: string) {
	const api = await getCalendar()
	const data = await api.events.list({
		calendarId,
		orderBy: 'startTime',
		showDeleted: false,
		singleEvents: true,
		timeMin: start,
		timeMax: finish
	})
	const events = data.data.items
	return events
}
