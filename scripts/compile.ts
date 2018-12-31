// 302 - temporary redirect
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { array } from '../shared/links'

// types
type Route =
	| { src: string; dest: string }
	| { src: string; status: number; headers: object }

interface NowConfig extends Object {
	routes: Route[]
}

// read
const nowFile = join(__dirname, '..', 'now.json')
const now = JSON.parse(readFileSync(nowFile, 'utf8')) as NowConfig

// prefil
now.routes = [
	{ src: '/favicon.ico', dest: '/static/favicon.ico' },
	{ src: '/robots.txt', dest: '/static/robots.txt' },
	{ src: '/calendar.ics', dest: '/api/ics' },
	{
		src: '/api/(?<key>[^./]*)/?',
		dest: '/server/api/$key.ts',
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	}
]

// epxand
array.forEach(function(value) {
	const src = `/${value.id}/?`
	const dest = value.url
	now.routes.push({
		src,
		status: 302,
		headers: {
			Location: dest
		}
	})
})

// sort to reduce diff overheads
function comparator(a: string, b: string) {
	return a < b ? -1 : a === b ? 0 : 1
}
now.routes = now.routes.sort((a, b) => comparator(a.src, b.src))

// write
writeFileSync(nowFile, JSON.stringify(now, null, '  ') + '\n')
