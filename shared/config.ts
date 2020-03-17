export const TEST_STATES = false // process.env.NODE_ENV === 'development'
// export const podcastJoinUrl = 'https://meet.bevry.me/join'
// export const podcastWatchUrl = 'https://meet.bevry.me/watch'
// export const expiresValue = 3
// export const expiresUnit = 'hour'
// export const useFauna = true
/** Offset in milliseconds */
export const timezoneOffset = new Date().getTimezoneOffset() * 60000
export const isServer = typeof window === 'undefined'
export const isBrowser = !isServer
export const privacyIllustrations = {
	public: '/illustrations/undraw_conference_uo36.svg',
	protected: '/illustrations/undraw_conversation_h12g.svg',
	private: '/illustrations/undraw_security_o890.svg'
}
export const loginUrl = '/api/auth/login'
export const logoutUrl = '/api/auth/logout'
export const profileApiUrl = '/api/auth/profile'
export const profileUrl = '/profile'
export const homeUrl = '/'
export const eventsUrl = '/events/list'
export const newEventUrl = '/events/add'
export const logoUrl =
	'https://bevry-discourse-v3-forum.s3.dualstack.eu-west-3.amazonaws.com/original/1X/fec1014a4a297f617236c03264f71e05336bd293.svg'
export const theme = {
	colors: {
		topBar: {
			background: '#AAA'
		}
	},
	logo: {
		width: 124,
		topBarSource: logoUrl,
		url: homeUrl,
		accessibilityLabel: 'Bevry'
	}
}
