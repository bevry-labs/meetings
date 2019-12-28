import * as yup from 'yup'

export const addSchema = yup.object({
	name: yup
		.string()
		.label('Event Name')
		.min(8)
		.required(),
	description: yup.string().label('Description'),
	start: yup
		.date()
		.label('Start Time')
		// .min('')
		.required(),
	end: yup
		.date()
		.label('End Time')
		.min(yup.ref('start'))
		.required()
})

export type AddSchema = yup.InferType<typeof addSchema>
