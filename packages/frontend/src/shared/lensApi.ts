import { ApolloClient, InMemoryCache } from '@apollo/client'
import { env } from '@shared/environment'

export const lensApiClient = new ApolloClient({
  uri: env.lensApiUrl,
  cache: new InMemoryCache(),
})
