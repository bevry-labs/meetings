import React from 'react'
import Head from 'next/head'
import { AppProvider, Page as PolarisPage } from '@shopify/polaris'
import { Children } from '../../shared/types'

interface LayoutProps {
	children: Children
	title?: string
}

function Page({
	children,
	title = 'Jordan B Peterson Community'
}: LayoutProps) {
	return (
		<div>
			<Head>
				<title key="title">{title}</title>
				<meta
					key="viewport"
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<meta
					name="keywords"
					content="jordan b peterson, jbp, jordan peterson, peterson, psychology, philosophy, maps of meaning, psychological signficance of the biblical stories, bible, community, fans, study group, lecture notes, reading group, forum, discussion"
				/>
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
