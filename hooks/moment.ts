import { useState, useEffect } from 'react'
import { Moment, default as moment } from 'moment'

function determineInterval(raw: Moment): number {
	const input = raw.clone()
	const result = input.fromNow()
	if (result !== input.add({ second: 1 }).fromNow()) {
		return 1000
	}
	if (result !== input.add({ minute: 1 }).fromNow()) {
		return (60 - moment().seconds()) * 1000
	}
	return 5 * 60 * 1000
}

export function useMoment(moment: Moment) {
	const [interval, setInterval] = useState(determineInterval(moment))
	useEffect(function() {
		const timer = setTimeout(() => {
			setInterval(determineInterval(moment))
		}, interval)
		return () => clearInterval(timer)
	})
}
