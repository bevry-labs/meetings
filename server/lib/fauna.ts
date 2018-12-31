/* eslint new-cap:0 */
import { Client, query as q } from 'faunadb'
import { getEnv } from './env'

export const client = new Client({ secret: getEnv('FAUNA_SERVER_KEY') })

export function getKey(key: string) {
	return client.query(q.Paginate(q.Match(q.Index('kvp_by_key'), key)))
}

export async function setKeyValue(key: string, value: any) {
	const result = await getKey(key)
	console.log(result)

	return client.query(
		q.Create(q.Class('kvp'), {
			data: { name: key, value }
		})
	)

	/*
	client
		.query(
			q.Replace(q.Ref(q.Class('kvp'), '181388642581742080'), {
				data: {
					name: "Mountain's Thunder",
					element: ['air', 'earth'],
					cost: 10
				}
			})
		)
		.then(ret => console.log(ret))
		*/
}
