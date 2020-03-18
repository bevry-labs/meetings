import { NextApiRequest, NextApiResponse } from 'next'

import auth0 from '../../../lib/auth0'

export default async function profile(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		// await new Promise(function(resolve) {
		// 	setTimeout(resolve, 3000)
		// })
		await auth0.handleProfile(req, res, {})
	} catch (error) {
		console.log(error)
		res.status(error.status || 500).end(error.message)
	}
}
