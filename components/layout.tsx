import Head from 'next/head'
import { AppProvider, Page } from '@shopify/polaris'
import { Children } from '../types'
interface LayoutProps {
	children: Children
	title?: string
}
export default ({
	children,
	title = 'Jordan B Peterson Community'
}: LayoutProps) => (
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
			<Page fullWidth title={title}>
				{children}
			</Page>
		</AppProvider>
	</div>
)
