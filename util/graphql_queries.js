import { gql } from '@apollo/client';

/* Send a Ref form query to search for series titles */
export const SEARCH_SERIES_TITLES_QUERY = gql`
  query searchSeriesQuery($searchTerm: String!) {
    searchSeriesQuery(searchTerm: $searchTerm) {
      title
      year
    }
  }
`;

/* Send a Ref form query to search for series titles */
export const SEARCH_MOVIE_TITLES_QUERY = gql`
  query searchMoviesQuery($searchTerm: String!) {
    searchMoviesQuery(searchTerm: $searchTerm) {
      title
      year
    }
  }
`;

/* ImageMasonry query to retrieve series artworks */
export const GET_SERIES_ARTWORKS = gql`
  query GetSeriesArtworks($productionId: Int!, $productionType: String!) {
    seriesScenes(productionId: $productionId, productionType: $productionType) {
      id
      sceneDescription
      sceneImgUrl
      season
      episode
      artworks {
        id
        artist
        artworkTitle
        year
        size
        currentLocation
        description
        imageUrl
      }
    }
  }
`;

/* ImageMasonry query to retrieve movies artworks */
export const GET_MOVIE_ARTWORKS = gql`
  query GetMovieArtworks($productionId: Int!, $productionType: String!) {
    movieScenes(productionId: $productionId, productionType: $productionType) {
      id
      sceneDescription
      sceneImgUrl
      artworks {
        id
        artist
        artworkTitle
        year
        size
        currentLocation
        description
        imageUrl
      }
    }
  }
`;
