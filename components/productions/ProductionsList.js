import React from 'react';
import { useQuery, gql } from '@apollo/client';
import ImageMasonry from '../ui/ImageMasonry';
import { useSearch } from '../../context/SearchContext';
import Typography from '@mui/joy/Typography';

const GET_SERIES_AND_MOVIES = gql`
  query {
    movies {
      id
      productionTitle
      year
      imageUrl
    }
    series {
      id
      productionTitle
      year
      imageUrl
    }
  }
`;

function ProductionsList() {
  const { loading, error, data } = useQuery(GET_SERIES_AND_MOVIES, {
    fetchPolicy: 'cache-and-network',
  });
  const { searchQuery } = useSearch();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const movies = data.movies.map((movie) => ({
    ...movie,
    productionType: 'movie', // Add productionType property
  }));
  const series = data.series.map((seriesItem) => ({
    ...seriesItem,
    productionType: 'series', // Add productionType property
  }));

  // Combine movies and series into a single array
  const allProductions = [...movies, ...series];

  // Filter the data based on the search query
  const filteredProductions = allProductions.filter((item) =>
    item.productionTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let content;
  if (filteredProductions.length) {
    content = <ImageMasonry itemData={filteredProductions} />;
  } else {
    content = (
      <div>
        <Typography level="h4" component="h1" sx={{ textAlign: 'center' }}>
          <b>No references found for this title.</b>
        </Typography>
      </div>
    );
  }

  return content;
}

export default ProductionsList;
