import { IENV } from '../shared/types'
import SHARED_ENV from '../shared/env'

// If we have access to process.env (which the server will, if not client-side rendering)
// then merge it with the shared env
const SERVER_ENV: IENV =
	typeof process?.env?.FOUNTAIN === 'undefined'
		? SHARED_ENV
		: {
				auth0: {
					...SHARED_ENV.auth0,
					...JSON.parse(process.env.FOUNTAIN as string).auth0
				},
				fauna: {
					...SHARED_ENV.fauna,
					...JSON.parse(process.env.FOUNTAIN as string).fauna
				}
		  }

// Export as default
export default SERVER_ENV
