import React from 'react';
import { useQuery, gql } from '@apollo/client';
import ImageMasonry from '../ui/ImageMasonry';
import { useSearch } from '../../context/SearchContext';

const GET_MOVIES = gql`
  query {
    movies {
      id
      productionTitle
      year
      imageUrl
    }
  }
`;

function MoviesList() {
  const { loading, error, data } = useQuery(GET_MOVIES, {
    fetchPolicy: 'cache-and-network',
  });
  const { searchQuery } = useSearch();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const movies = data.movies;

  // Filter the data based on the search query
  const filteredProductions = movies.filter((item) =>
    item.productionTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return <ImageMasonry itemData={filteredProductions} />;
}

export default MoviesList;
