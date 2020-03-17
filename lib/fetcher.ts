import fetch from 'isomorphic-unfetch'
import { rgbString } from '@shopify/polaris'

export default async function<JSON = any>(
	input: RequestInfo,
	init?: RequestInit
): Promise<JSON> {
	const res = await fetch(input, init)
	return res.ok ? res.json() : Promise.reject(new Error(res.statusText))
}
