import ApolloClient from 'apollo-client'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getSeedMutations } from './seed-mutations'
import { setContext } from 'apollo-link-context';

dotenv.config()

const {
  GRAPHQL_SERVER_HOST: host,
  GRAPHQL_SERVER_PORT: port,
  GRAPHQL_SERVER_PATH: path,
} = process.env

const uri = `http://${host}:${port}${path}`

const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri, fetch })),
  cache: new InMemoryCache(),
})


const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const runMutations = () => {
  const mutations = getSeedMutations()
  console.log(mutations);
  console.log(uri);

  return Promise.all(
    mutations.map(({ mutation, variables }) => {
      return client
        .mutate({
          mutation,
          variables,
        })
    })
  )
}

runMutations()
  .then(() => {
    console.log('Database seeded!')
  })
  .catch((e) => console.error(e))
