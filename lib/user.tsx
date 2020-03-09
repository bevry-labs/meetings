import { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import { loginUrl, meUrl } from '../shared/config'

export async function fetchUser(cookie = '') {
	const window_user = (window as any).__user
	if (typeof window !== 'undefined' && window_user) {
		return window_user
	}

	const res = await fetch(
		meUrl,
		cookie
			? {
					headers: {
						cookie
					}
			  }
			: {}
	)

	if (!res.ok) {
		delete (window as any).__user
		return null
	}

	const json = await res.json()
	if (typeof window !== 'undefined') {
		;(window as any).__user = json
	}
	return json
}

export function useFetchUser({ required } = { required: false }) {
	const window_user = (window as any).__user
	const [loading, setLoading] = useState(
		() => !(typeof window !== 'undefined' && window_user)
	)
	const [user, setUser] = useState(() => {
		if (typeof window === 'undefined') {
			return null
		}

		return window_user || null
	})

	useEffect(
		() => {
			if (!loading && user) {
				return
			}
			setLoading(true)
			let isMounted = true

			fetchUser().then(user => {
				// Only set the user if the component is still mounted
				if (isMounted) {
					// When the user is not logged in but login is required
					if (required && !user) {
						window.location.href = loginUrl
						return
					}
					setUser(user)
					setLoading(false)
				}
			})

			return () => {
				isMounted = false
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	)

	return { user, loading }
}
