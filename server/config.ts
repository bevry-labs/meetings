import { FaunaConfig } from '../shared/types'
export const googleCalendarId =
	'bevry.me_qeq66am9eji1bcll7ntrn3u830@group.calendar.google.com'
if (!process.env.FAUNA) throw new Error('fauna config has not been specified')
export const faunaConfig = JSON.parse(
	process.env.FAUNA as string
) as FaunaConfig
