// page that prints out javascript

import { useQuery } from '@apollo/client'
import { GET_PROFILE_BY_HANDLE_QUERY } from '@shared/lensApiQueries'
import { NextPage } from 'next'

const Test: NextPage = () => {
  const { data, loading, error } = useQuery(GET_PROFILE_BY_HANDLE_QUERY, {
    variables: { handle: 'yoginth.test' },
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>{JSON.stringify(error)}</div>

  return <div>{JSON.stringify(data)}</div>
}

export default Test
