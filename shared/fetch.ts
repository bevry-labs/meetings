import fetchl from 'fetch-lite'
export default function fetchJSON(url: string) {
	console.log('fetchJSON', url, typeof fetch)
	if (typeof fetch === 'undefined') {
		return fetchl(url).then(response =>
			typeof response.body === 'string'
				? Promise.reject(new Error(response.body))
				: response.body
		)
	} else {
		return fetch(url).then(response => response.json())
	}
}
