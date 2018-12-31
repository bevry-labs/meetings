import { useState, useEffect, useMemo } from 'react'
import { Moment, default as moment } from 'moment'

function fromNow(input: Moment, subtraction: Object) {
	return input
		.clone()
		.subtract(subtraction)
		.fromNow()
}

function millisecondsUntil(input: Moment): number {
	return input.diff(moment(), 'milliseconds')
}

function millisecondsFrom(input: Moment): number {
	return Math.abs(millisecondsUntil(input))
}

function determineClosest(...inputs: Moment[]): Moment {
	const now = moment()
	let closest = inputs[0]
	let closestDelta = millisecondsFrom(closest)
	for (let i = 1; i < inputs.length; i++) {
		const current = inputs[i]
		const currentDelta = millisecondsFrom(current)
		if (currentDelta < closestDelta) {
			closest = current
			closestDelta = currentDelta
		}
	}
	return closest
}

function determineClosestDelta(...inputs: Moment[]): number {
	const closest = determineClosest(...inputs).clone()
	const result = closest.fromNow()
	console.log(result)
	if (result !== fromNow(closest, { seconds: 1 })) {
		return 1000
	}
	if (result !== fromNow(closest, { seconds: 30 })) {
		return 15 * 1000
	}
	if (result !== fromNow(closest, { minutes: 1 })) {
		return (60 - moment().seconds()) * 1000
	}
	return 5 * 60 * 1000
}

function determineSoonest(...inputs: Moment[]): Moment {
	return inputs.reduce((a, b) => (a.isBefore(b) ? a : b))
}

function determineSoonestDelta(...inputs: Moment[]): number {
	const soonest = determineSoonest(...inputs)
	return millisecondsUntil(soonest)
}

export function useTimeout(time: number) {
	const [delta, setDelta] = useState(time)
	useEffect(function() {
		if (delta < 0) return
		const timer = setTimeout(() => {
			setDelta(-1)
		}, time)
		return () => timer && clearTimeout(timer)
	})
	return delta
}

export function useInterval(time: number) {
	const [iterations, setIterations] = useState(0)
	useEffect(function() {
		const timer = setTimeout(() => {
			setIterations(iterations + 1)
		}, time)
		return () => clearTimeout(timer)
	})
	return iterations
}

export function useDynamicInterval(callback: () => number) {
	const [interval, setInterval] = useState(callback())
	useEffect(function() {
		const timer = setTimeout(() => {
			setInterval(callback())
		}, interval)
		return () => clearInterval(timer)
	})
	return interval
}

export function useFromNow(...inputs: Moment[]) {
	return useDynamicInterval(() => determineClosestDelta(...inputs))
}

export function useWhen(...inputs: Moment[]) {
	return useTimeout(determineSoonestDelta(...inputs))
}
