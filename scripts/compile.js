// 302 - temporary redirect
const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const redirects = JSON.parse(
	readFileSync(join(__dirname, '..', 'redirects.json'), 'utf8')
)
const NOW_FILE = join(__dirname, '..', 'now.json')
const now = JSON.parse(readFileSync(NOW_FILE, 'utf8'))
now.routes = [
	{ src: '/favicon.ico', dest: '/static/favicon.ico' },
	{ src: '/robots.txt', dest: '/static/robots.txt' },
	{ src: '/calendar.ics', dest: '/api/ics/' }
]
Object.keys(redirects).forEach(function(key) {
	const dest = redirects[key]
	now.routes.push({
		src: key,
		status: 302,
		headers: {
			Location: redirects[key]
		}
	})
})
writeFileSync(NOW_FILE, JSON.stringify(now, null, '  ') + '\n')
