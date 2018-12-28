export function getEnv(key: string): any {
	const value = process.env[key]
	if (!value) throw new Error(`process.env.${key} was not found`)
	return value
}

export function fromBase64(value: string): string {
	return Buffer.from(value, 'base64').toString('ascii')
}

export function toBase64(value: string): string {
	return Buffer.from(value, 'ascii').toString('base64')
}

export function parseEnv<T extends Object>(value: string): T {
	return JSON.parse(fromBase64(value))
}

export function createEnv(value: Object): string {
	return toBase64(JSON.stringify(value))
}
