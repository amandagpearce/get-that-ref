import React from 'react';
import { useQuery, gql } from '@apollo/client';
import ImageMasonry from '../ui/ImageMasonry';
import { useSearch } from '../../context/SearchContext';

const GET_SERIES = gql`
  query {
    series {
      id
      productionTitle
      year
      imageUrl
    }
  }
`;

function SeriesList() {
  const { loading, error, data } = useQuery(GET_SERIES, {
    fetchPolicy: 'cache-and-network',
  });
  const { searchQuery } = useSearch();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const series = data.series;

  // Filter the data based on the search query
  const filteredProductions = series.filter((item) =>
    item.productionTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return <ImageMasonry itemData={filteredProductions} />;
}

export default SeriesList;
