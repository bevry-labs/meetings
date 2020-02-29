/* eslint-disable */
import * as React from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'
import { useRouter } from 'next/router'
import { NextPage } from 'next'

function DEFAULT_REDIRECT_CALLBACK() {
	console.log('HI IM DEFUALT CALLBACK')
	return window.history.replaceState(
		{},
		document.title,
		window.location.pathname
	)
}

interface Auth0ProviderProps {
	children: React.ReactNode
	onRedirectCallback: (arg0?: any) => any
	domain: string
	clientId: string
	redirectUri: string
}

interface Auth0ContextProps {
	isAuthenticated: boolean
	user: any
	loading: boolean
	popupOpen: boolean
	loginWithPopup?: (options?: any) => any
	handleRedirectCallback: (options?: any) => any
	getIdTokenClaims: (options?: any) => any
	loginWithRedirect: (options?: any) => any
	getTokenSilently: (options?: any) => any
	getTokenWithPopup: (options?: any) => any
	logout: (options?: any) => any
}

export const Auth0Context = React.createContext<Auth0ContextProps>(
	{} as Auth0ContextProps
)

export function useAuth0(): Auth0ContextProps {
	return React.useContext(Auth0Context)
}

export function Auth0Provider({
	children,
	onRedirectCallback,
	domain,
	clientId,
	redirectUri
}: Auth0ProviderProps) {
	const [isAuthenticated, setIsAuthenticated] = React.useState()
	const [user, setUser] = React.useState()
	const [auth0Client, setAuth0] = React.useState()
	const [loading, setLoading] = React.useState(true)
	const [popupOpen, setPopupOpen] = React.useState(false)

	React.useEffect(() => {
		const initAuth0 = async () => {
			const auth0FromHook = await createAuth0Client({
				domain,
				client_id: clientId,
				redirect_uri: redirectUri
			})
			setAuth0(auth0FromHook)

			if (window.location.search.includes('code=')) {
				console.log('FOUND FOUND FOUND')
				const user = await auth0FromHook.getUser()
				console.log(user)
				const { appState } = await auth0FromHook.handleRedirectCallback()
				console.log('after redirect callback')
				onRedirectCallback(appState)
			}

			const isAuthenticated = await auth0FromHook.isAuthenticated()

			setIsAuthenticated(isAuthenticated)

			if (isAuthenticated) {
				const user = await auth0FromHook.getUser()
				setUser(user)
			}

			setLoading(false)
		}

		initAuth0()
	}, [])

	const loginWithPopup = async (params = {}) => {
		setPopupOpen(true)
		try {
			await auth0Client.loginWithPopup(params)
		} catch (error) {
			console.error(error)
		} finally {
			setPopupOpen(false)
		}
		const user = await auth0Client.getUser()
		setUser(user)
		setIsAuthenticated(true)
	}

	const handleRedirectCallback = async () => {
		setLoading(true)
		await auth0Client.handleRedirectCallback()
		const user = await auth0Client.getUser()
		setLoading(false)
		setIsAuthenticated(true)
		setUser(user)
	}

	return (
		<Auth0Context.Provider
			value={{
				isAuthenticated,
				user,
				loading,
				popupOpen,
				loginWithPopup,
				handleRedirectCallback,
				getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
				loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
				getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
				getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
				logout: (...p) => auth0Client.logout(...p)
			}}
		>
			{children}
		</Auth0Context.Provider>
	)
}

interface RequireUserProps {
	children: React.ReactNode
}

export const requireUser = (
	page: NextPage
): React.FunctionComponent<NextPage> => {
	return (props: any) => {
		const router = useRouter()
		const { loading, isAuthenticated, loginWithRedirect } = useAuth0()

		React.useEffect(() => {
			if (loading || isAuthenticated) {
				return
			}

			const fn = async () => {
				await loginWithRedirect({
					appState: { targetUrl: router.asPath }
				})
			}
			fn()
		}, [loading, isAuthenticated, loginWithRedirect, router.pathname])

		if (loading || !isAuthenticated) {
			return null
		}

		return React.createElement(page, props)
	}
}
