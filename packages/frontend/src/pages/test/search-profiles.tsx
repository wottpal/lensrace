// page that prints out javascript

import { useLazyQuery } from '@apollo/client'
import { SEARCH_PROFILES_BY_HANDLE } from '@shared/lensApiQueries'
import debounce from 'lodash.debounce'
import { NextPage } from 'next'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

const Test: NextPage = () => {
  const { register, watch } = useForm<{ query: string }>({ mode: 'onChange' })
  const query = watch('query')

  const [search, { data, loading, error }] = useLazyQuery(SEARCH_PROFILES_BY_HANDLE)
  const debouncedSearch = useCallback(
    debounce(() => {
      if (!query) return
      console.log(`Searching ${query}…`)
      search({
        variables: {
          request: {
            query,
            limit: 10,
            type: 'PROFILE',
          },
        },
      })
    }, 1000),
    [query],
  )
  useEffect(() => {
    debouncedSearch()
  }, [query])

  console.log({ data })
  return (
    <>
      <form>
        <input type="text" placeholder="Search profile" {...register('query')} />
      </form>

      {loading && <div>Loading...</div>}
      {error && <div>{JSON.stringify(error)}</div>}
      {!loading && !!data?.['search']?.['items']?.length && (
        <ul>
          {data['search']['items'].map((item: any) => (
            <li key={item.profileId}>{item.name}</li>
          ))}
        </ul>
      )}
    </>
  )
}

export default Test
