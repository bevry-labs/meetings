// External
import React from 'react'
import useSWR from 'swr'
import {
	Banner,
	SkeletonPage,
	Layout,
	Card,
	TextContainer,
	SkeletonDisplayText,
	SkeletonBodyText,
	Page
} from '@shopify/polaris'

// Local
import Fountain from '../components/layout'

// Page
export default function Profile() {
	const { data, error } = useSWR('/api/auth/me')

	console.log({ data, error })

	if (error)
		return (
			<Fountain>
				<Banner title="Failed to load" status="critical">
					<p>{error}</p>
				</Banner>
			</Fountain>
		)

	if (!data)
		return (
			<Fountain title="Profile Pa">
				<SkeletonPage primaryAction secondaryActions={2}>
					<Layout>
						<Layout.Section>
							<Card sectioned>
								<SkeletonBodyText />
							</Card>
							<Card sectioned>
								<TextContainer>
									<SkeletonDisplayText size="small" />
									<SkeletonBodyText />
								</TextContainer>
							</Card>
							<Card sectioned>
								<TextContainer>
									<SkeletonDisplayText size="small" />
									<SkeletonBodyText />
								</TextContainer>
							</Card>
						</Layout.Section>
					</Layout>
				</SkeletonPage>
			</Fountain>
		)

	return (
		<Fountain>
			<Page
				title="Invoice"
				subtitle="Statement period: May 3, 2019 to June 2, 2019"
				secondaryActions={[{ content: 'Download' }]}
			>
				<pre>
					<code>{JSON.stringify(data)}</code>
				</pre>
			</Page>
		</Fountain>
	)
}
