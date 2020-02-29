/* eslint-disable */
import * as React from 'react'
import App from 'next/app'
import Head from 'next/head'
import { Auth0Provider } from '../server/auth0-spa'

export default class MyApp extends App {
	render() {
		const { Component, pageProps, router } = this.props

		console.log('_APP COMPONENNT')
		const onRedirectCallback = (appState: {
			targetUrl: string | import('url').UrlObject
		}) => {
			console.log('hi i amn callback')
			console.log('appState', appState)

			router.push(appState && appState.targetUrl ? appState.targetUrl : '/')
		}

		return (
			<React.Fragment>
				<Head>
					<title>My App</title>
				</Head>
				<Auth0Provider
					// domain={process.env.AUTH0_DOMAIN}
					// clientId={process.env.AUTH0_CLIENT_ID}
					domain={'dev-bevry.auth0.com'}
					clientId={'7tW2mwbXs3Ob4JYsdHm1toLnxgPBcK4q'}
					redirectUri={'http://localhost:3000/callback'}
					onRedirectCallback={onRedirectCallback}
				>
					<Component {...pageProps} router={router} />
				</Auth0Provider>
			</React.Fragment>
		)
	}
}
