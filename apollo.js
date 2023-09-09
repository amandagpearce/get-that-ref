import { ApolloClient, InMemoryCache } from '@apollo/client';

// Series GraphQL endpoint
const seriesClient = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_ART_REFS_API_URL}/graphql/series`,
  cache: new InMemoryCache(),
});

// Movies GraphQL endpoint
const moviesClient = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_ART_REFS_API_URL}/graphql/movies`,
  cache: new InMemoryCache(),
});

export { seriesClient, moviesClient };
