import React, { useState, useEffect, useCallback } from 'react'
import Router from 'next/router'
import { AppProvider, TopBar, Frame } from '@shopify/polaris'

// Local
import {
	loginUrl,
	logoutUrl,
	logoUrl,
	homeUrl,
	profileUrl
} from '../shared/config'

import { useFetchUser } from '../lib/user'

export default function BevryTopBar() {
	const { user } = useFetchUser()
	const [open, setOpen] = useState(false)
	const toggleOpen = useCallback(() => {
		setOpen(!open)
	}, [])
	const toggleNavigation = useCallback(() => {
		console.log('toggle navigation visibility')
	}, [])

	return (
		<TopBar
			showNavigationToggle
			userMenu={
				user ? (
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
						open={open}
						onToggle={toggleOpen}
					/>
				) : (
					<TopBar.UserMenu
						actions={[
							{
								items: []
							}
						]}
						name={'Login'}
						detail={'Click to login'}
						initials={'L'}
						open={open}
						onToggle={() => {
							window.location.href = loginUrl
						}}
					/>
				)
			}
			onNavigationToggle={toggleNavigation}
		/>
	)
}
