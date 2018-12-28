// Import
import { getEvents } from '../../util/google'
import { DateTime } from 'luxon'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'

async function processEvents() {
	const start = DateTime.local().setZone('Atlantic/Reykjavik')
	const finish = start.plus({ weeks: 1 })
	const events = await getEvents(start.toISO(), finish.toISO())
	return events
}

export default async function sendEvents(
	req: Http2ServerRequest,
	res: Http2ServerResponse
) {
	const data = await processEvents()
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(data))
}
