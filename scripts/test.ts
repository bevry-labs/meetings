import { processEvents } from '../server/api/events'

processEvents()
	.then(results => {
		if (results.length === 0) {
			throw new Error('no events')
		} else {
			console.log('OK', results)
		}
	})
	.catch(err => {
		throw err
	})
