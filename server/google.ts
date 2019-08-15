/* eslint camelcase:0 */

// Import
import { google } from 'googleapis'
import { getEnv, parseEnv } from './env'
import { googleCalendarId } from '../shared/config'

// Scopes
const scopes = [
	// View events on all your calendars
	'https://www.googleapis.com/auth/calendar.events.readonly',
	// View your calendars
	'https://www.googleapis.com/auth/calendar.readonly',
	// View your Calendar settings
	'https://www.googleapis.com/auth/calendar.settings.readonly',
	// Youtube
	'https://www.googleapis.com/auth/youtube.readonly'
]

interface GoogleService {
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
interface GoogleOAuth {
	web: {
		client_id: string
		project_id: string
		auth_uri: string
		token_uri: string
		auth_provider_x509_cert_url: string
		client_secret: string
		redirect_uris: string[]
		javascript_origins: string[]
	}
}

function getServiceAuth() {
	const credentials = parseEnv<GoogleService>(getEnv('GOOGLE_SERVICE'))
	return google.auth.getClient({
		credentials,
		scopes,
		projectId: credentials.project_id
	})
}

export function getOAuth() {
	const credentials = parseEnv<GoogleOAuth>(getEnv('GOOGLE_OAUTH'))
	const redirect = credentials.web.redirect_uris[0]
	return new google.auth.OAuth2(
		credentials.web.client_id,
		credentials.web.client_secret,
		redirect
	)
}

export function getOAuthLoginUrl() {
	const client = getOAuth()
	const authUrl = client.generateAuthUrl({
		// Specify the scopes we need
		scope: scopes,
		// Allow ourselves to refresh the access token
		access_type: 'offline'
	})
	return authUrl
}

export function getOAuthCredentials() {
	const credentials = parseEnv(getEnv('GOOGLE_OAUTH_RESULT'))
	// check if still valid
	// if not, redirect to login flow
}

export async function getCalendar() {
	const auth = await getServiceAuth()
	return google.calendar({ version: 'v3', auth })
}

export async function getEvents(start: string, finish: string) {
	const calendarId = googleCalendarId
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
	return events || []
}

export async function getYoutube() {
	const auth = getOAuth()
	return google.youtube({ version: 'v3', auth })
}

export async function getBroadcasts() {
	const api = await getYoutube()
	return api.liveBroadcasts.list({
		part: 'id,snippet,contentDetails,status',
		broadcastStatus: 'upcoming',
		broadcastType: 'all'
	})
	/*
	return api.liveBroadcasts.list({
		part: 'id,snippet,contentDetails,status',
		broadcastStatus: 'active',
		broadcastType: 'all'
	})
	*/
}
