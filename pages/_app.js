import Head from 'next/head';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './_app.css';

import Header from '../components/layout/Header';
import Marquee from '../components/ui/Marquee';
import { SearchProvider } from '../context/SearchContext';
import { Container } from '@mui/material';

const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_ART_REFS_API_URL}/graphql`, // Your Flask GraphQL API endpoint
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Got that ref?</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Marquee>
        SEEN A VISUAL ARTS REFERENCE IN MOVIES OR SERIES? SEND IT TO US HERE
      </Marquee>

      <SearchProvider>
        <Header />

        <ApolloProvider client={client}>
          <Container maxWidth="xlg" style={{ background: '#efeffd' }}>
            <main style={{ padding: '30px 0' }}>
              <Component {...pageProps} />
            </main>
          </Container>
        </ApolloProvider>
      </SearchProvider>
    </>
  );
}
