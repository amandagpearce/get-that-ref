import { ApolloClient, InMemoryCache } from '@apollo/client';

// GraphQL endpoint
const client = new ApolloClient({
  // uri: `${process.env.NEXT_PUBLIC_ART_REFS_API_URL}/graphql`,
  uri: `http://127.0.0.1:4000/graphql`,
  cache: new InMemoryCache(),
});

export { client };
