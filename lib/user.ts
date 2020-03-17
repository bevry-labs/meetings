import useSWR from './swr'
import { profileApiUrl } from '../shared/config'
import { IUser } from '../shared/types'
export default function useUser() {
	return useSWR<IUser, any>(profileApiUrl)
}
