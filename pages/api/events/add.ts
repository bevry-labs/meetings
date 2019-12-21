/* eslint camelcase:0, new-cap:0 */
import { NextApiRequest, NextApiResponse } from 'next'
import fauna, { query as q } from 'faunadb'
import cuid from 'cuid'
import { faunaConfig } from '../../../server/config'

/* Gets the data from client side when user creates a new event
 * by filling up a Form and clicking Submit. Here we should
 * create the faundaDb entry for the same. */
export default async function sendEvents(
	req: NextApiRequest,
	res: NextApiResponse
) {
	/* TODO: I think we should create a global fauna client at server init and use that everywhere. */
	const client = new fauna.Client({ secret: faunaConfig.secret_key })

	if (req.method === 'POST') {
		const data = {
			id: cuid(),
			...req.body
		}

		console.log('Post: New Event To be Added')
		console.log(data)

		if (
			req.body.summary &&
			req.body.description &&
			req.body.start.dateTime.length === 24 &&
			req.body.end.dateTime.length === 24
		) {
			console.log('Sending fauna query')
			await client
				.query(
					q.Create(q.Collection('posts'), {
						data
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
		} else {
			res.status(400).end() // Bad request
		}
	}
}
