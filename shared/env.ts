import { IENV } from './types'

// Put all public environment variables here essentially
const SHARED_ENV: IENV = {
	auth0: {
		clientId: '7tW2mwbXs3Ob4JYsdHm1toLnxgPBcK4q',
		domain: 'dev-bevry.auth0.com',
		redirectUri: 'http://localhost:3000/api/auth/callback',
		postLogoutRedirectUri: 'http://localhost:3000/',
		scope: 'openid profile'
	},
	fauna: {
		events_database_name: 'posts'
	}
}
export default SHARED_ENV
