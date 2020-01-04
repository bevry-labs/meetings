/**
 * import { getEventsFromCalendar } from '../pages/api/events/list'

getEventsFromCalendar()
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
**/

// stop linter error
import '../shared/config'
// @todo add tests
console.log('no tests')
