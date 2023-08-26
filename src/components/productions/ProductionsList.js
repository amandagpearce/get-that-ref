// components/SeriesList.js

import { useQuery, gql } from '@apollo/client';
import ImageMasonry from '../ui/ImageMasonry';

const GET_PRODUCTIONS = gql`
  query {
    series {
      id
      title
      year
      image_url
    }
    movies {
      id
      title
      year
      image_url
    }
  }
`;

function ProductionsList() {
  const { loading, error, data } = useQuery(GET_PRODUCTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const series = data.series,
    movies = data.movies,
    combinedProductions = series.concat(movies);

  return <ImageMasonry itemData={combinedProductions} />;
}

export default ProductionsList;
