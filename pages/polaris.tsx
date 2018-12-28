import Head from 'next/head'
import { AppProvider, Page, Card, Button } from '@shopify/polaris'
export default () => (
	<div>
		<Head>
			<title>Polaris</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="stylesheet" href="//unpkg.com/normalize.css/normalize.css" />
			<link
				rel="stylesheet"
				href="//sdks.shopifycdn.com/polaris/3.3.0/polaris.min.css"
			/>
		</Head>
		<AppProvider>
			<Page title="Example app">
				<Card sectioned>
					<Button onClick={() => alert('Button clicked!')}>
						Example button
					</Button>
				</Card>
			</Page>
		</AppProvider>
	</div>
)
