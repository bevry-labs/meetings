import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import { createEnv } from '../../util/env'
import { setKeyValue } from '../../util/fauna'
import { getOAuthLoginUrl, getOAuth } from '../../util/google'
import { URL } from 'url'

function processUserAuth(code: string): Promise<ReturnType<typeof getOAuth>> {
	const client = getOAuth()
	return client.getToken(code).then(function({ tokens }) {
		client.setCredentials(tokens)
		return setKeyValue('google-oauth-result', createEnv(tokens)).then(
			() => client
		)
	})
}

export default async function sendEvents(
	req: Http2ServerRequest,
	res: Http2ServerResponse
) {
	const url = new URL(req.url)
	const code = url.searchParams.get('code')
	if (code) {
		processUserAuth(code)
		res.end('ok')
	} else {
		const authUrl = getOAuthLoginUrl()
		res.writeHead(302, {
			Location: authUrl,
			'Content-Type': 'text/plain'
		})
		res.end(`redirecting to ${authUrl}`)
	}
}
