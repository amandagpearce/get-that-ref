import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { moviesClient, seriesClient } from '../../apollo';
import MoviesList from './MoviesList';
import SeriesList from './SeriesList';

const ProductionsList = () => {
  return (
    <>
      <MoviesList />
      <SeriesList />
    </>
  );
};

export default ProductionsList;
