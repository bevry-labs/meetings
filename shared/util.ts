import { IncomingMessage } from 'http'
import { timezoneOffset } from './config'

export function getHostname(req?: IncomingMessage): string {
	// req is server-side
	// location is client-side
	// we could just use '' on client-side, which will respect ports better, but this is fine
	// because `/api/events` is the same on client-side as `https://hostname/api/events`
	// a href="/api/events" => "https://hostname/api/events"
	const host = (req && req.headers.host) || (location && location.host) || ''
	if (!host) throw new Error('failed to identify the host')
	return host.startsWith('localhost') ? `http://${host}` : `https://${host}`
}

export function padDigits(number: number, digits: number) {
	return String(number).padStart(2, '0')
}

export function getLocalISOString(date: Date) {
	return (
		date.getFullYear() +
		'-' +
		padDigits(date.getMonth() + 1, 2) +
		'-' +
		padDigits(date.getDate(), 2) +
		'T' +
		padDigits(date.getHours(), 2) +
		':' +
		padDigits(date.getMinutes(), 2)
	)
}

export function getTimezone() {
	return Intl.DateTimeFormat().resolvedOptions().timeZone
}
