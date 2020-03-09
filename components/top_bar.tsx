import React, { useState, useEffect, useCallback } from 'react'
import Router from 'next/router'
import { AppProvider, TopBar, Card, Frame, ActionList } from '@shopify/polaris'

import { useFetchUser } from '../lib/user'
import { loginUrl, logoUrl, homeUrl, profileUrl } from '../shared/config'

export default function TopBarExample() {
	const { user } = useFetchUser()
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

	const toggleIsUserMenuOpen = useCallback(
		() => setIsUserMenuOpen(isUserMenuOpen => !isUserMenuOpen),
		[]
	)

	const handleNavigationToggle = useCallback(() => {
		console.log('toggle navigation visibility')
	}, [])

	console.log('XXXXXXXXXXXXXXXXXXX RENDING TOPBAR')
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

	const userMenuMarkup = (
		<TopBar.UserMenu
			actions={[
				{
					items: [
						{
							content: 'Login',
							onAction() {
								window.location.href = loginUrl
							}
						},
						{
							content: 'About Me',
							onAction() {
								window.location.href = profileUrl
							}
						}
					]
				}
			]}
			name={user ? user.nickname : 'Login'}
			detail={user ? user.name : 'Click to login'}
			initials={user ? user.nickname['0'] : 'L'}
			open={isUserMenuOpen}
			onToggle={toggleIsUserMenuOpen}
		/>
	)

	const topBarMarkup = (
		<TopBar
			showNavigationToggle
			userMenu={userMenuMarkup}
			onNavigationToggle={handleNavigationToggle}
		/>
	)

	return (
		<div style={{ height: '10px' }}>
			<AppProvider
				theme={theme}
				i18n={{
					Polaris: {
						Avatar: {
							label: 'Avatar',
							labelWithInitials: 'Avatar with initials {initials}'
						},
						Frame: { skipToContent: 'Skip to content' },
						TopBar: {
							toggleMenuLabel: 'Toggle menu'
						}
					}
				}}
			>
				<Frame topBar={topBarMarkup} />
			</AppProvider>
		</div>
	)
}
