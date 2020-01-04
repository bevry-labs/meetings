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
