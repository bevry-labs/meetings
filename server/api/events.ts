// Import
import Daet from 'daet'
import { getEvents } from '../lib/google'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import { expiresValue, expiresUnit } from '../../shared/config'

async function processEvents() {
	const now = new Daet()
	const start = now.minus(expiresValue, expiresUnit)
	const finish = now.plus(1, 'week').plus(1, 'day')
	const events = await getEvents(start.toISOString(), finish.toISOString())
	return events.filter(item => item.visibility === 'public')
}

export default async function sendEvents(
	req: Http2ServerRequest,
	res: Http2ServerResponse
) {
	const data = await processEvents()
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(data))
}
