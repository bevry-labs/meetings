import { initAuth0 } from '@auth0/nextjs-auth0'
import SERVER_ENV from '../server/env'

export default initAuth0(SERVER_ENV.auth0)
