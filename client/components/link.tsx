import React from 'react'
import { map } from '../../shared/links'
import { LinkProps, default as NextLink } from 'next/link'

interface CustomLinkProps {
	id: string
	text?: string
}

function Link(props: CustomLinkProps) {
	const { id, text } = props
	const link = map.get(id)
	if (!link) throw new Error('custom link not found')
	return (
		<NextLink href={link.url}>
			<a>{text || link.text}</a>
		</NextLink>
	)
}

export default Link
