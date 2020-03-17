// External
import useSWR from 'swr'

// Local
import fetcher from '../lib/fetcher'

// useSWR as Polaris is incompatible with SWRConfig
export default function<Result, Error>(url: string) {
	return useSWR<Result, Error>(url, fetcher, { refreshInterval: 3000 })
}
