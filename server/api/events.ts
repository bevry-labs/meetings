// Import
import { getEvents } from '../lib/google'
import Daet from '../../shared/daet'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'

async function processEvents() {
	const start = new Daet()
	const finish = start.plus(1, 'week')
	const events = await getEvents(start.toISOString(), finish.toISOString())
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
