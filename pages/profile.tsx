// renders on both server and client
// Fetch user profile, login if necessary, give user prop to component:
// https://github.com/zeit/next.js/blob/master/examples/auth0/pages/advanced/ssr-profile.js
import React from 'react'

import { NextApiRequest, NextApiResponse } from 'next'

// This import is only needed when checking authentication status directly from getInitialProps
import auth0 from '../lib/auth0'
import { fetchUser } from '../lib/user'
import { ISession } from '@auth0/nextjs-auth0/dist/session/session'

import { loginUrl } from '../shared/config'

function Profile({ user }: { user: any }) {
	return (
		<div>
			<h1>Profile</h1>

			<div>
				<h3>Profile (server rendered)</h3>
				<img src={user?.picture} alt="user picture" />
				<p>nickname: {user.nickname}</p>
				<p>name: {user.name}</p>
			</div>
		</div>
	)
}

Profile.getInitialProps = async ({
	req,
	res
}: {
	req: NextApiRequest
	res: NextApiResponse
}) => {
	// On the server-side you can check authentication status directly
	// However in general you might want to call API Routes to fetch data
	// An example of directly checking authentication:
	if (typeof window === 'undefined') {
		const session = await auth0.getSession(req)
		const user =
			session === undefined || session === null
				? undefined
				: (session as ISession)?.user

		if (!user) {
			res.writeHead(302, {
				Location: loginUrl
			})
			res.end()
			return
		}
		return { user }
	}

	// To do fetches to API routes you can pass the cookie coming from the incoming request on to the fetch
	// so that a request to the API is done on behalf of the user
	// keep in mind that server-side fetches need a full URL, meaning that the full url has to be provided to the application
	const cookie = req && req.headers.cookie
	const user = await fetchUser(cookie)

	// A redirect is needed to authenticate to Auth0
	if (!user) {
		if (typeof window === 'undefined') {
			res.writeHead(302, {
				Location: loginUrl
			})
			return res.end()
		}

		window.location.href = loginUrl
	}

	return { user }
}

export default Profile
