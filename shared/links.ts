type LinkRaw = {
	text: string
	url: string
	tags?: string[]
}
interface LinksRaw {
	[index: string]: string | LinkRaw
}

type Link = {
	id: string
	text: string
	url: string
	tags: string[]
}

const raw: LinksRaw = {
	home: {
		text: 'The Jordan B Peterson Community Homepage',
		url: 'https://jordanbpeterson.community'
	},
	newsletter: {
		text: 'Newsletter',
		url: 'https://goo.gl/forms/qgIjkJ8SYEpLCVY83',
		tags: ['home']
	},
	forum: {
		text: 'Discussion Forum',
		url: 'https://discuss.jordanbpeterson.community',
		tags: ['home']
	},
	'study-group': {
		text: 'Study Group',
		url: 'https://discuss.jordanbpeterson.community/t/about-the-meetings/92',
		tags: ['home']
	},
	calendar: {
		text: ' Jordan B Peterson Community Calendar',
		url:
			'https://discuss.jordanbpeterson.community/t/please-unsubscribe-from-the-calendar-subscription/474'
	},
	'lecture-notes': {
		text: 'Lecture Notes',
		url: 'https://discuss.jordanbpeterson.community/categories',
		tags: ['home']
	},
	'reading-group': {
		text: 'Reading Group',
		url:
			'https://www.goodreads.com/group/show/253798-jordan-b-peterson-reading-group',
		tags: ['home']
	},
	'reading-list': {
		text: 'Reading List',
		url:
			'https://www.goodreads.com/group/bookshelf/253798-jordan-b-peterson-reading-group?utf8=✓&order=d&sort=date_finished&view=main&per_page=200',
		tags: ['home']
	},
	youtube: {
		text: 'YouTube',
		url: 'https://www.youtube.com/channel/UCPkobzBsAIjpItonUT7AU9Q',
		tags: ['home']
	},
	twitter: {
		text: 'Twitter',
		url: 'https://twitter.com/JBPCommunity',
		tags: ['home']
	},
	discord: {
		text: 'Discord',
		url: 'https://discord.gg/j2PqA7S',
		tags: ['home']
	},
	reddit: {
		text: 'Reddit',
		url: 'https://www.reddit.com/r/JordanPeterson',
		tags: ['home']
	},
	meetups: {
		text: 'Meetups',
		url:
			'https://www.meetup.com/find/?allMeetups=false&keywords=jordan+peterson&radius=Infinity',
		tags: ['home']
	},
	'facebook-liberal-group': {
		text: 'Facebook Liberal Discussion Group',
		url: 'https://www.facebook.com/groups/1408546319260687/',
		tags: ['home']
	},
	'facebook-study-group': {
		text: 'Facebook Study Group',
		url: 'https://www.facebook.com/groups/198567587146349/',
		tags: ['home']
	},
	source: {
		text: 'Website Source-Code',
		url: 'https://github.com/bevry/jordanbpeterson.community',
		tags: ['home']
	},
	feedback: {
		text: 'Feedback',
		url: 'https://discuss.jordanbpeterson.community/c/feedback',
		tags: ['home']
	},
	'podcast-join': 'home',
	podcast: 'youtube',
	'study-group-recordings': 'youtube',
	'study-group-hangout': 'study-group',
	'study-group-calendar': 'calendar',
	'calendar.ics': 'calendar',
	'macos-calendar-support': 'calendar',
	'ios-calendar-support': 'calendar',
	'outlook-calendar-support': 'calendar',
	'google-calendar-support': 'calendar'
}

// fetch value recursively
function delve(key: string): Link {
	const value = raw[key]
	if (value == null) {
		throw new Error(`The link alias [${key}] was not found.`)
	}
	if (typeof value === 'string') {
		return Object.assign({}, delve(value), {
			id: key,
			tags: ['alias']
		})
	}
	return Object.assign({ id: key, tags: [] }, value)
}

// generate map
export const map = new Map<String, Link>()
Object.keys(raw).forEach(function(key) {
	map.set(key, delve(key))
})

// genereate array
export const array: Link[] = Array.from(map.values())

// filters
export function filter(tag: string): Link[] {
	return array.filter(link => link.tags.includes(tag))
}
