import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { moviesClient, seriesClient } from '../../apollo';
import MoviesList from './MoviesList';
import SeriesList from './SeriesList';

const ProductionsList = () => {
  return (
    <>
      <ApolloProvider client={moviesClient}>
        <MoviesList />
      </ApolloProvider>
      <ApolloProvider client={seriesClient}>
        <SeriesList />
      </ApolloProvider>
    </>
  );
};

export default ProductionsList;
