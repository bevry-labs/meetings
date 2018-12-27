import Head from 'next/head'
import { filter } from '../data/links'
export default () => (
	<div>
		<Head>
			<title>Jordan B Peterson Community</title>
			<meta
				name="keywords"
				content="jordan b peterson, jbp, jordan peterson, peterson, psychology, philosophy, maps of meaning, psychological signficance of the biblical stories, bible, community, fans, study group, lecture notes, reading group, forum, discussion"
			/>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="stylesheet" href="//unpkg.com/normalize.css/normalize.css" />
			<link rel="stylesheet" href="/static/style.css" />
		</Head>
		<h1>Jordan B Peterson Community</h1>
		<ul>
			{filter('home').map(link => (
				<li key={link.id}>
					<a href={link.url}>{link.text}</a>
				</li>
			))}
		</ul>
	</div>
)
