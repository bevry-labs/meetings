import React from 'react'
import Head from 'next/head'
import translations from '@shopify/polaris/locales/en.json'
import { AppProvider, Frame } from '@shopify/polaris'
import { Children, Child } from '../shared/types'
import dynamic from 'next/dynamic'

// Local
import {
	loginUrl,
	logoutUrl,
	logoUrl,
	homeUrl,
	profileUrl
} from '../shared/config'

// Theme
const theme = {
	colors: {
		topBar: {
			background: '#FFFFFF'
		}
	},
	logo: {
		width: 124,
		topBarSource: logoUrl,
		url: homeUrl,
		accessibilityLabel: 'Bevry'
	}
}

// Props
interface LayoutProps {
	children: Children | Child
	title?: string
}

// Components
export default function Layout({
	children,
	title = 'Bevry Meetings'
}: LayoutProps) {
	const topBarMarkup = dynamic(() => import('./topbar'), { ssr: false })
	return (
		<div>
			<Head>
				<title key="title">{title}</title>
				<meta
					key="viewport"
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<meta name="keywords" content="bevry, discussion, meetings, meet" />
				<link
					rel="stylesheet"
					href="//unpkg.com/@shopify/polaris@4/styles.min.css"
				/>
			</Head>
			<AppProvider theme={theme} i18n={translations}>
				<Frame topBar={topBarMarkup}>{children}</Frame>
			</AppProvider>
		</div>
	)
}
