import { IncomingMessage } from 'http'

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
