type LinkRaw = {
	text: string
	url: string
	tags?: string[]
}
interface LinksMap {
	[index: string]: string | LinkRaw
}
type LinkHydrated = {
	id: string
	text: string
	url: string
	tags: string[]
}
type LinksArray = LinkHydrated[]

export const Links: LinksMap = {
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
	'study-group-calendar': {
		text: 'Study Group Calendar',
		url: '/calendar'
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
	'podcast-join': {
		text: 'Join the Podcast Sessions',
		url:
			'https://discuss.jordanbpeterson.community/t/jbp-community-podcast-join-links-scheduling/361'
	},
	'macos-calendar-support': {
		text: 'macOS Calendar Support',
		url: 'https://support.apple.com/kb/PH11523'
	},
	'ios-calendar-support': {
		text: 'iOS Calendar Support',
		url: 'https://support.apple.com/kb/HT202361'
	},
	'outlook-calendar-support': {
		text: 'Outlook Calendar Support',
		url:
			'https://support.office.com/en-us/article/Import-or-subscribe-to-a-calendar-in-Outlook-com-or-Outlook-on-the-web-CFF1429C-5AF6-41EC-A5B4-74F2C278E98C'
	},
	'google-calendar-support': {
		text: 'Google Calendar Support',
		url:
			'https://support.google.com/calendar/answer/37100?co=GENIE.Platform%3DDesktop&hl=en&oco=1'
	},
	podcast: 'youtube',
	'study-group-recordings': 'youtube',
	'study-group-hangout': 'study-group'
}

// fetch value recursively
function delve(linksMap: LinksMap, key: string): LinkRaw {
	const value = linksMap[key]
	if (value == null) {
		throw new Error(`The link alias [${key}] was not found.`)
	}
	if (typeof value === 'string') {
		return Object.assign({ id: key }, delve(linksMap, value), {
			tags: ['alias']
		})
	}
	return Object.assign({ id: key, tags: [] }, value)
}

// export array
export const links = Object.keys(Links).map(function(key) {
	return delve(Links, key)
}) as LinksArray

// filters
export function filter(tag: string): LinksArray {
	return links.filter(link => link.tags.includes(tag))
}
