// page that prints out javascript

import { gql, useQuery } from '@apollo/client'

import { NextPage } from 'next'

const Test: NextPage = () => {
  const { data, loading, error } = useQuery(gql`
    query {
      ping
    }
  `)

  if (loading) return <div>Loading...</div>
  if (error) return <div>{JSON.stringify(error)}</div>

  return <div>{JSON.stringify(data)}</div>
}

export default Test
