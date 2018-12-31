import { map } from '../../shared/links'
import { LinkProps, default as Link } from 'next/link'
interface CustomLinkProps {
	id: string
	text?: string
}
export default (props: CustomLinkProps) => {
	const { id, text } = props
	const link = map.get(id)
	if (!link) throw new Error('custom link not found')
	return (
		<Link href={link.url}>
			<a>{text || link.text}</a>
		</Link>
	)
}
