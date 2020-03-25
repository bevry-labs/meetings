import { NextApiRequest, NextApiResponse } from 'next'

import auth0 from '../../../lib/auth0'

export default async function callback(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		// create fauna user if not exists
		// log them in
		// give fauna secret to them
		await auth0.handleCallback(req, res, { redirectTo: '/' })
	} catch (error) {
		console.error(error)
		res.status(error.status || 500).end(error.message)
	}
}
