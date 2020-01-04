import * as yup from 'yup'
import Daet from 'daet'
// https://github.com/jquense/yup/issues/737

export enum Privacy {
	Public = 'public',
	Protected = 'protected',
	Private = 'private'
}

// what is common among all
export const baseEventSchema = yup.object({
	title: yup
		.string()
		.label('Event Name')
		.min(8)
		.required(),
	description: yup.string().label('Description'),
	privacy: yup
		.string()
		// public - join and watch available
		// protected - join onl available to participants
		// private - join and watch only available to participants
		.matches(/(public|protected|private)/)
		.required(),
	tz: yup.string().required(),
	cancelled: yup
		.bool()
		.default(false)
		.required(),
	joinURL: yup
		.string()
		.label('Join URL')
		// join links may not be known at the time, as:
		// (1) those details may not have been figured out yet
		// (2) someone without permission could be adding the event (such as a follower of a thought leader) on behalf of the host
		// (3) they may not be using a method that supports joining via URLs
		// this will eventually be resolvable as fountain provides its own zoom meeting support
		.notRequired(),
	watchURL: yup
		.string()
		.label('Watch URL')
		// watch links may not be known at the time as:
		// (1) those details may not have been figured out yet
		// (2) it may be a confidential meeting without a watch link
		.notRequired()
})
export type BaseEventSchema = yup.InferType<typeof baseEventSchema>

// what our form uses
export const addEventSchema = baseEventSchema.shape({
	start: yup
		.date()
		.label('Start Time')
		.max(yup.ref('finish'))
		.required(),
	finish: yup
		.date()
		.label('Finish Time')
		.min(yup.ref('start'))
		.required(),
	expiry: yup
		.date()
		.label('Expiry Time')
		.min(yup.ref('finish'))
		.required()
})
export type AddEventSchema = yup.InferType<typeof addEventSchema>

// what our server uses
export interface RawEventSchema extends BaseEventSchema {
	id: string
	start: string
	finish: string
	expiry: string
}

// what our client uses
export interface RichEventSchema extends BaseEventSchema {
	id: string
	start: Daet
	finish: Daet
	expiry: Daet
}
