/* eslint camelcase:0, new-cap:0 */
import Daet from 'daet'
import { NextApiRequest, NextApiResponse } from 'next'

/* Gets the data from client side when user creates a new event
 * by filling up a Form and clicking Submit. Here we should
 * create the faundaDb entry for the same. */
export default async function sendEvents(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const faunadb = require('faunadb')
	const q = faunadb.query
	const faunaEnv = JSON.parse(process.env.FAUNADB || '{ }')
	const faunaSecret = faunaEnv.FAUNADB_SECRET_KEY
	/* TODO: I think we should create a global fauna client at server init and use that everywhere. */
	const client = new faunadb.Client({ secret: faunaSecret })

	if (req.method === 'POST') {
		const now = new Daet()
		console.log(now.toISOString())
		/* Must be unique for every event. Adding random to handle the case where
		 * use clicks submit multiple times on dev machine and getTime() is the same. */
		const id = now.getTime() + Math.random()

		console.log('Post: New Event To be Added')
		console.log({
			id,
			...req.body
		})

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
						data: {
							id,
							...req.body
						}
					})
				)
				.then((ret: any) => {
					console.log(ret)
					res.status(201).end() // Created
				})
				.catch((err: any) => {
					console.warn('FAILED TO FETCH EVENTS FROM FAUNADB:', err)
					res.status(500).end() // Server Error
				})
		} else {
			res.status(400).end() // Bad request
		}
	}
}
