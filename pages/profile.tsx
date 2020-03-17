// External
import React from 'react'
import useSWR from '../lib/swr'
import {
	Banner,
	SkeletonPage,
	Layout,
	Card,
	TextContainer,
	SkeletonDisplayText,
	SkeletonBodyText,
	Page,
	Avatar
} from '@shopify/polaris'

// Local
import Fountain from '../components/layout'
import { profileApiUrl } from '../shared/config'
import { IUser } from '../shared/types'

// Page
export default function Profile() {
	const { data: user, error, isValidating } = useSWR<IUser, any>(profileApiUrl)
	let inner

	if (error)
		inner = (
			<Banner title="Failed to load" status="critical">
				<p>{JSON.stringify(error)}</p>
			</Banner>
		)
	else if (!user)
		inner = (
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
		)
	else {
		// @todo add editing from
		// https://polaris.shopify.com/components/structure/frame#navigation
		inner = (
			<Page title="Profile" subtitle={user.name}>
				<Avatar customer name={user.nickname} source={user.picture} />
			</Page>
		)
	}

	return (
		<Fountain url="/profile" title="Profile">
			{inner}
		</Fountain>
	)
}
