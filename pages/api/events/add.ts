/* eslint camelcase:0, new-cap:0 */
import { NextApiRequest, NextApiResponse } from 'next'
import fauna, { query as q } from 'faunadb'
import cuid from 'cuid'
import SERVER_ENV from '../../../server/env'
import {
	addEventSchema,
	AddEventSchema,
	RawEventSchema
} from '../../../shared/schemas'

/* Gets the data from client side when user creates a new event
 * by filling up a Form and clicking Submit. Here we should
 * create the faundaDb entry for the same. */
export default async function sendEvents(
	req: NextApiRequest,
	res: NextApiResponse
) {
	/* TODO: I think we should create a global fauna client at server init and use that everywhere. */
	const client = new fauna.Client({
		secret: SERVER_ENV.fauna.secret_key as string
	})

	if (req.method === 'POST') {
		// Prepare
		const body: AddEventSchema = req.body

		// validate
		try {
			const data = await addEventSchema.validate(body)
			const event: RawEventSchema = {
				id: cuid(),
				title: data.title,
				description: data.description,
				// store in UTC
				start: data.start.toISOString(),
				finish: data.finish.toISOString(),
				expiry: data.expiry.toISOString(),
				cancelled: data.cancelled || false,
				privacy: data.privacy,
				tz: data.tz,
				joinURL: data.joinURL,
				watchURL: data.watchURL
			}

			// Add
			console.log('Post: New Event To be Added')
			console.log(event)

			// Send
			await client
				.query(
					q.Create(q.Collection('posts'), {
						data: event
					})
				)
				.then((ret: any) => {
					console.log(ret)
					// res.status(201).send({success: true, message: 'ok', data: {id: 1 /* the data of the created event */}})
					res.status(201).end() // Created
				})
				.catch((err: any) => {
					// res.status(500).send({success: false, message: 'masdasd'})
					console.warn('FAILED TO FETCH EVENTS FROM FAUNADB:', err)
					res.status(500).end() // Server Error
				})
		} catch (err) {
			console.error('failure', err)
			return res.status(400).end(err?.message) // Bad request
		}
	}
}
