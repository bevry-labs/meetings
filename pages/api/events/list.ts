// External
import Daet from 'daet'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import faunadb, { query as q } from 'faunadb'

// Internal
import { faunaConfig } from '../../../server/config'
import { RawEventSchema } from '../../../shared/schemas'
import { getLocalISOString } from '../../../shared/util'

/*
import { getEvents } from '../../../server/google'
export async function getEventsFromCalendar() {
	const now = new Daet()
	const start = now.minus(expiresValue, expiresUnit)
	const finish = now.plus(1, 'week').plus(1, 'day')
	const events = await getEvents(start.toISOString(), finish.toISOString())
	return events.filter(item => item.visibility === 'public')
}
*/

// eventually, move this to client-side with a client key used as the secret
export async function getEventsFromFauna(): Promise<RawEventSchema[]> {
	// @todo replace with client key
	const client = new faunadb.Client({ secret: faunaConfig.secret_key })

	console.log(
		'Listing events beyond Expiry Date of ' + new Daet().toISOString()
	)
	const events: RawEventSchema[] = []
	/* Get the unique faunadb ID for all events. */
	await client
		.query(
			q.Map(
				q.Paginate(q.Match(q.Index('event_list_by_expiry_date')), {
					after: new Daet().toISOString()
				}),
				q.Lambda(['expiry', 'event_ref'], q.Get(q.Var('event_ref')))
			)
		)
		.then(function(dbentry: any) {
			dbentry.data.map((x: { data: RawEventSchema }) =>
				events.push(x.data as RawEventSchema)
			)
			console.log(events)
			return events
		})
		.catch((err: any) => {
			console.warn(
				'FAILED TO FETCH EVENTS FROM FAUNADB:',
				faunaConfig.events_database_name,
				err
			)
			return []
		})
	return events
}

export default async function sendEvents(
	req: Http2ServerRequest,
	res: Http2ServerResponse
) {
	const data = await getEventsFromFauna()
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify(data))
}
