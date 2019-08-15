export function getEnv(key: string): any {
	const value = process.env[key]
	if (!value) throw new Error(`process.env.${key} was not found`)
	return value
}

export function parseEnv<T extends Object>(value: string): T {
	return JSON.parse(value)
}

export function createEnv(value: Object): string {
	return JSON.stringify(value)
}
