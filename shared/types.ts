// JSX
export type Child = string | JSX.Element
export type Children = Array<Child>

// Fauna Configuration
export interface FaunaConfig {
	secret_key: string
	events_database_name: string
}
