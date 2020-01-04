// External
import Daet from 'daet'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import faunadb, { query as q } from 'faunadb'

// Internal
import { faunaConfig } from '../../../server/config'
import { RawEventSchema } from '../../../shared/schemas'

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
	let ids: String[] = []

	/* Get the unique faunadb ID for all events. */
	await client
		.query(q.Paginate(q.Match(q.Index('all_posts'))))
		.then(function(dbentry: any) {
			ids = dbentry.data.map((x: { id: string }) => x.id)
			return ids
		})
		.catch((err: any) => {
			console.warn(
				'FAILED TO FETCH EVENTS FROM FAUNADB:',
				faunaConfig.events_database_name,
				err
			)
			return []
		})

	/* Read the data for the events from faunadb.
	 * TODO: It would be good if it can be done in one step i.e. read the data
	 * for all the events in one go rather than first reading ids and then sending
	 * a query for every id. */
	const events: RawEventSchema[] = []
	for (const id of ids) {
		console.log('Querying ID: ' + id)
		await client
			.query(q.Get(q.Ref(q.Collection(faunaConfig.events_database_name), id)))
			.then((dbentry: any) => {
				events.push(dbentry.data as RawEventSchema)
			})
			.catch((err: any) => {
				console.warn(
					'FAILED TO FETCH EVENTS FROM FAUNADB:',
					faunaConfig.events_database_name,
					err
				)
				return []
			})
	}
	console.log(events)
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
