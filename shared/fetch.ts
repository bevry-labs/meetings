import fetchl from 'fetch-lite'
export default function fetchJSON(url: string) {
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
