import { map } from '../data/links'
import { LinkProps, default as Link } from 'next/link'
interface CustomLinkProps extends Partial<LinkProps> {
	id: string
	text?: string
}
export default (props: CustomLinkProps) => {
	const { id, text } = props
	const link = map.get(id)
	if (!link) throw new Error('custom link not found')
	props = { href: link.url, ...props }
	return (
		<Link {...props}>
			<a>{text || link.text}</a>
		</Link>
	)
}
