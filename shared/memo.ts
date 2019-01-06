export default function memo<T>(callback: () => T) {
	let value: T
	return () => (typeof value !== 'undefined' ? value : (value = callback()))
}
