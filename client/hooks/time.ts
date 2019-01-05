import { useState, useEffect, useMemo } from 'react'
import Daet from '../../shared/daet'
import { numberComparator } from '../../shared/comparators'

export function useTimeout(milliseconds: number): boolean {
	const [done, setDone] = useState(false)
	useEffect(function() {
		if (done || milliseconds < 0) return
		const timer = setTimeout(() => {
			setDone(true)
		}, milliseconds)
		return () => timer && clearTimeout(timer)
	})
	return done
}

export function useInterval(milliseconds: number): number {
	const [iterations, setIterations] = useState(0)
	useEffect(function() {
		if (milliseconds < 0) return
		const timer = setTimeout(() => {
			setIterations(iterations + 1)
		}, milliseconds)
		return () => clearTimeout(timer)
	})
	return iterations
}

/** As we work with dates in seconds, do not cause an interval less than a second, as otherwise an infinite amount of renders will occur within that second. Also, if delta is negative, then maintain it, as that means we want a noop. */
function overSecond(delta: number) {
	return delta < 0 || delta > 1000 ? delta : 1000
}
/*

// http://momentjs.com/docs/#/displaying/fromnow/
const thresholdBases: { [index: string]: number } = {
	s: 1,
	ss: 1,
	m: 60,
	mm: 60,
	h: 60 * 60,
	hh: 60 * 60,
	d: 60 * 60 * 24,
	dd: 60 * 60 * 24
}
const thresholdKeys = Object.keys(thresholdBases)
function getThreshold(tier: string) {
	const threshold = moment.relativeTimeThreshold(tier)
	if (typeof threshold === 'boolean' || threshold < 0) return -1
	return threshold * thresholdBases[tier]
}
function secondsToMilliseconds(seconds: number): number {
	const value = Math.abs(seconds)
	let result = 0
	let until = value
	for (const key of thresholdKeys) {
		const threshold = getThreshold(key)
		if (value <= threshold) {
			// console.log({ value, key, threshold })
			result = value - until
			break
		}
		until = value
	}
	return result * 1000
}

function dateToSeconds(input: Moment): number {
	return input.diff(moment(), 'seconds')
}

export function useFutureDate(input: Moment) {
	const seconds = dateToSeconds(input)
	const milliseconds = overSecond(
		seconds < 0 ? -1 : secondsToMilliseconds(seconds)
	)
	// console.log('useFutureDate', milliseconds, new Date())
	return useInterval(milliseconds)
}

export function usePastDate(input: Moment) {
	const seconds = dateToSeconds(input)
	const milliseconds = overSecond(
		seconds < 0 ? secondsToMilliseconds(seconds) : seconds * 1000
	)
	// console.log('usePastDate', milliseconds, new Date())
	return useInterval(milliseconds)
}

export function useDate(input: Moment) {
	const milliseconds = overSecond(
		input.milliseconds() - moment().milliseconds()
	)
	// console.log('useDate', milliseconds, new Date())
	return useInterval(milliseconds)
}
*/
