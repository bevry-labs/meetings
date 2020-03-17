import React, { useCallback, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import translations from '@shopify/polaris/locales/en.json'
import { AppProvider, Frame, Navigation, TopBar } from '@shopify/polaris'
import { LinkLikeComponentProps } from '@shopify/polaris/types/utilities/link'
import {
	CustomersMajorMonotone,
	ProfileMajorMonotone,
	CalendarMajorMonotone,
	CalendarTickMajorMonotone,
	HomeMajorMonotone
} from '@shopify/polaris-icons'

// Local
import { Children, Child } from '../shared/types'
import {
	theme,
	logoutUrl,
	profileUrl,
	loginUrl,
	eventsUrl,
	homeUrl,
	newEventUrl
} from '../shared/config'
import useUser from '../lib/user'
import { getInitials } from '../shared/util'

// Link Proxy
function LinkProxy({ children, url, ...rest }: LinkLikeComponentProps) {
	return (
		<Link href={url}>
			<a {...rest}>{children}</a>
		</Link>
	)
}

// Layout Properties
interface LayoutProps {
	children: Children | Child
	url: string
	title?: string
}

// Components
export default function Layout({
	children,
	url,
	title = 'Bevry Meetings'
}: LayoutProps) {
	// User
	const { data: user } = useUser()

	// State
	const [mobileNavigationActive, setMobileNavigationActive] = useState(false)
	const toggleMobileNavigationActive = useCallback(
		() =>
			setMobileNavigationActive(
				mobileNavigationActive => !mobileNavigationActive
			),
		[]
	)

	// Navigation
	const navMarkup = (
		<Navigation location={url}>
			<Navigation.Section
				items={[
					{
						label: 'Home',
						icon: HomeMajorMonotone,
						url: homeUrl,
						exactMatch: true
					}
				]}
			/>
			<Navigation.Section
				items={[
					{
						label: 'Events',
						icon: CalendarMajorMonotone,
						url: eventsUrl
					},
					{
						label: 'New Event',
						icon: CalendarTickMajorMonotone,
						url: newEventUrl,
						disabled: !user
					}
				]}
			/>
			<Navigation.Section
				items={
					user
						? [
								{
									label: 'Profile',
									icon: ProfileMajorMonotone,
									url: profileUrl
								},
								{
									label: 'Logout',
									icon: CustomersMajorMonotone,
									url: logoutUrl
								}
						  ]
						: [
								{
									label: 'Login',
									icon: CustomersMajorMonotone,
									url: loginUrl
								}
						  ]
				}
			/>
		</Navigation>
	)

	// Logged in menu state
	const [userMenuActive, setUserMenuActive] = useState<boolean>(false)
	const toggleUserMenuActive = useCallback(() => {
		setUserMenuActive(!userMenuActive)
	}, [])

	// Adjust menu based on user state
	const userMenuMarkup = user ? (
		<TopBar.UserMenu
			actions={[
				{
					items: [
						{
							content: 'Profile',
							icon: ProfileMajorMonotone,
							url: profileUrl
						},
						{
							content: 'Logout',
							icon: CustomersMajorMonotone,
							url: logoutUrl
						}
					]
				}
			]}
			name={user.nickname}
			detail={user.name}
			initials={getInitials(user.nickname)}
			open={userMenuActive}
			onToggle={toggleUserMenuActive}
		/>
	) : (
		undefined
	)
	const topBarMarkup = (
		<TopBar
			showNavigationToggle
			onNavigationToggle={toggleMobileNavigationActive}
			userMenu={userMenuMarkup}
		/>
	)

	// Layout
	return (
		<AppProvider theme={theme} i18n={translations} linkComponent={LinkProxy}>
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
			<Frame
				navigation={navMarkup}
				topBar={topBarMarkup}
				showMobileNavigation={mobileNavigationActive}
				onNavigationDismiss={toggleMobileNavigationActive}
			>
				{children}
			</Frame>
		</AppProvider>
	)
}
