import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

const cache = new InMemoryCache();

async function setupCache() {
  await persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
  });
}
setupCache();

const apolloClient = new ApolloClient({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  cache,
});

export default apolloClient;
