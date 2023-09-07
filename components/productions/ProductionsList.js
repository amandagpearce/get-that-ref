// components/SeriesList.js

import { useQuery, gql } from '@apollo/client';
import ImageMasonry from '../ui/ImageMasonry';
import { useSearch } from '../../context/SearchContext';

const GET_PRODUCTIONS = gql`
  query {
    series {
      id
      productionTitle
      year
      imageUrl
    }
    movies {
      id
      productionTitle
      year
      imageUrl
    }
  }
`;

function ProductionsList() {
  const { loading, error, data } = useQuery(GET_PRODUCTIONS, {
    fetchPolicy: 'cache-and-network',
  });
  const { searchQuery } = useSearch();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const series = data.series,
    movies = data.movies,
    combinedProductions = series.concat(movies);

  // Filter the data based on the search query
  const filteredProductions = combinedProductions.filter((item) =>
    item.productionTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('data.series', data.series);

  return <ImageMasonry itemData={filteredProductions} />;
}

export default ProductionsList;
