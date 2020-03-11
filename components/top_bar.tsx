import React, { useState, useEffect, useCallback } from 'react'
import Router from 'next/router'
import { AppProvider, TopBar, Card, Frame, ActionList } from '@shopify/polaris'

import { useFetchUser } from '../lib/user'
import {
	loginUrl,
	logoutUrl,
	logoUrl,
	homeUrl,
	profileUrl
} from '../shared/config'

export default function BevryTopBar() {
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

	const userMenuMarkupAfterLogin = (
		<TopBar.UserMenu
			actions={[
				{
					items: [
						{
							content: 'Logout',
							onAction() {
								window.location.href = logoutUrl
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

	const userMenuMarkupBeforeLogin = (
		<TopBar.UserMenu
			actions={[
				{
					items: []
				}
			]}
			name={'Login'}
			detail={'Click to login'}
			initials={'L'}
			open={isUserMenuOpen}
			onToggle={() => {
				window.location.href = loginUrl
			}}
		/>
	)

	const topBarMarkup = (
		<TopBar
			showNavigationToggle
			userMenu={user ? userMenuMarkupAfterLogin : userMenuMarkupBeforeLogin}
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
