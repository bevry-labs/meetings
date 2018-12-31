/* eslint new-cap:0 */
import { Client, query as q } from 'faunadb'
import { getEnv } from '../server/lib/env'
import { setSecret } from '../server/lib/zeit'
import { setKeyValue } from '../server/lib/fauna'
import Errlop = require('errlop')

const database = 'fountain_network_database'
const table = 'kvp'
const index = 'kvp_by_key'

async function declareDatabase(faunaSecret: string, zeitSecret: string) {
	let result: any

	const adminClient = new Client({ secret: faunaSecret })

	try {
		console.log('LIST DATABASES:')
		result = await adminClient.query(q.Paginate(q.Databases()))
		console.log(result)
	} catch (err) {
		console.error(new Errlop('Failed to list the databases.', err))
	}

	try {
		console.log('DELETE DATABASE:')
		result = await adminClient.query(q.Delete(q.Database(database)))
		console.log(result)
	} catch (err) {
		console.error(new Errlop('Failed to delete the database.', err))
	}

	try {
		console.log('CREATE DATABASE:')
		result = await adminClient.query(q.CreateDatabase({ name: database }))
		console.log(result)
	} catch (err) {
		console.error(new Errlop('Failed to create the database.', err))
		return
	}

	try {
		console.log('SERVER KEY:')
		result = await adminClient.query(
			q.CreateKey({
				database: q.Database(database),
				role: 'server'
			})
		)
		console.log(result)
	} catch (err) {
		console.error(new Errlop('Failed to create the server key.', err))
		return
	}

	try {
		console.log('ZEIT RESPONSE:')
		result = await setSecret('fauna-server-key', result.secret)
		console.log(result)
	} catch (err) {
		console.error(
			new Errlop('Failed to write the fauna server key into zeit.', err)
		)
		return
	}

	try {
		console.log('DELETE CLASS:')
		result = await adminClient.query(q.Delete(q.Class(table)))
		console.log(result)
	} catch (err) {
		console.error(new Errlop('Failed to delete the class.', err))
	}

	try {
		console.log('CREATE CLASS:')
		result = await adminClient.query(q.CreateClass({ name: table }))
		console.log(result)
	} catch (err) {
		console.error(new Errlop('Failed to create the class.', err))
		return
	}

	try {
		console.log('DELETE INDEX:')
		result = await adminClient.query(q.Delete(q.Index(index)))
		console.log(result)
	} catch (err) {
		console.error(new Errlop('Failed to delete the class.', err))
	}

	try {
		console.log('CREATE INDEX:')
		result = adminClient.query(
			q.CreateIndex({
				name: index,
				source: q.Class(table),
				terms: [{ field: ['data', 'key'] }]
			})
		)
		console.log(result)
	} catch (err) {
		console.error(new Errlop('Failed to create the server key.', err))
		return
	}
}

async function main() {
	const faunaSecret = getEnv('FAUNA_ADMIN_KEY')
	const zeitSecret = getEnv('ZEIT_TOKEN')
	return declareDatabase(faunaSecret, zeitSecret)
}
main()
