export function fromBase64(value: string): string {
	return Buffer.from(value, 'base64').toString('ascii')
}

export function toBase64(value: string): string {
	return Buffer.from(value, 'ascii').toString('base64')
}
