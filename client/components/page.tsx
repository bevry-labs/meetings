import React from 'react'
import Head from 'next/head'
import { AppProvider, Page as PolarisPage } from '@shopify/polaris'
import { LayoutProps } from '../../shared/types'

function Page({ children, title = 'Bevry Meetings' }: LayoutProps) {
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
					href="//sdks.shopifycdn.com/polaris/3.3.0/polaris.min.css"
				/>
			</Head>
			<AppProvider>
				<PolarisPage fullWidth title={title}>
					{children}
				</PolarisPage>
			</AppProvider>
		</div>
	)
}

export default Page
