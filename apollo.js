import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

const client = new ApolloClient({
  link: createUploadLink({
    uri: 'http://127.0.0.1:4000/graphql',
  }),
  cache: new InMemoryCache(),
});

export { client };
