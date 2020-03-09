import IAuth0Settings from '@auth0/nextjs-auth0/dist/settings'

// JSX
export type Child = string | JSX.Element
export type Children = Array<Child>

// ENV
export interface IENV {
	auth0: IAuth0Settings
	fauna: {
		secret_key?: string
		events_database_name: string
	}
}
