import { useState, useEffect } from 'react'

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
