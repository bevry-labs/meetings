// Import
import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import * as fetchImport from 'isomorphic-unfetch'
const fetch = (fetchImport.default || fetchImport) as typeof fetchImport.default

const url =
	'https://calendar.google.com/calendar/ical/bevry.me_qeq66am9eji1bcll7ntrn3u830%40group.calendar.google.com/public/basic.ics'

export default async function sendICS(
	req: Http2ServerRequest,
	res: Http2ServerResponse
) {
	let type = 'text/plain'
	fetch(url)
		.then(response => {
			type = response.headers.get('Content-Type') || 'text/plain'
			return response.text()
		})
		.then(data => {
			res.setHeader('Content-Type', type)
			res.end(data)
		})
}
