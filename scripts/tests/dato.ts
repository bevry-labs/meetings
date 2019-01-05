import { suite } from 'kava'
import { Second, Minute, Hour, Day, default as Dato } from '../../shared/dato'
import { equal } from 'assert-helpers'

suite('dato', function(suite, test) {
	test('add', function() {
		const d = Dato.create()
		equal(d.getDelta(), 0, 'zero')
		equal(d.add(1, 'second').getDelta(), Second, '1 second')
		equal(d.add(15, 'second').getDelta(), 15 * Second, '15 seconds')
		equal(d.add(1, 'minute').getDelta(), Minute, '1 minute')
		equal(d.add(15, 'minute').getDelta(), 15 * Minute, '15 minutes')
		equal(d.add(1, 'hour').getDelta(), Hour, '1 hour')
		equal(d.add(15, 'hour').getDelta(), 15 * Hour, '15 hours')
		equal(d.add(1, 'day').getDelta(), Day, '1 day')
		equal(d.add(15, 'day').getDelta(), 15 * Day, '15 days')
		equal(d.add(400, 'day').getDelta(), 400 * Day, '400 days')
	})
	test('fromNow', function() {
		const d = Dato.create()
		equal(d.fromNow(), 'right now')
		equal(d.add(1, 'second').fromNow(), '1 second')
		equal(d.add(15, 'second').fromNow(), '15 seconds')
		equal(d.add(1, 'minute').fromNow(), '1 minute')
		equal(
			d
				.add(1, 'minute')
				.add(30, 'second')
				.fromNow(),
			'1 minute',
			'1 minute 30 seconds'
		)
		equal(d.add(15, 'minute').fromNow(), '15 minutes')
		equal(d.add(1, 'hour').fromNow(), '1 hour')
		equal(
			d
				.add(1, 'hour')
				.add(30, 'minute')
				.fromNow(),
			'1 hour 30 minutes'
		)
		equal(d.add(15, 'hour').fromNow(), 'later today', '15 hours')
		equal(d.add(1, 'day').fromNow(), 'tomorrow', '1 day')
		equal(
			d
				.nextWeek()
				.add(2, 'day')
				.fromNow(),
			'next Tuesday'
		)
		equal(d.add(15, 'day').fromNow(), 'sometime later', '15 days')
		equal(d.add(400, 'day').fromNow(), 'sometime later', '400 days')
	})
})
