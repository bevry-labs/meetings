// JSX
export type Child = string | JSX.Element
export type Children = Array<Child>

// Fauna Configuration
export interface FaunaConfig {
	secret_key: string
	events_database_name: string
}

// Auth0 Configuration
export interface Auth0Config {
	domain: string
	client_id: string
}
