import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { env } from '@shared/environment'

const APIURL = env.lensApiUrl

export const lensClient = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})

const query = `
  query {
    ping
  }
`

export const queryExample = async () => {
  const response = await lensClient.query({
    query: gql(query),
  })
  console.log('Lens example data: ', response)
}
