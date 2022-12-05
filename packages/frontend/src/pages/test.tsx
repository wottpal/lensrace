// page that prints out javascript

import { gql, useQuery } from '@apollo/client'
import { NextPage } from 'next'

const GET_PROFILE_BY_HANDLE_QUERY = gql`
  query Profile($handle: Handle!) {
    profile(request: { handle: $handle }) {
      id
      name
      handle
      stats {
        totalFollowers
      }
    }
  }
`

const Test: NextPage = () => {
  const { data, loading, error } = useQuery(GET_PROFILE_BY_HANDLE_QUERY, {
    variables: { handle: 'yoginth.test' },
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>{JSON.stringify(error)}</div>

  return <div>{JSON.stringify(data)}</div>
}

export default Test
