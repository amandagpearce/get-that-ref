import { gql } from '@apollo/client';

export const SEARCH_SERIES_TITLES_QUERY = gql`
  query searchSeriesQuery($searchTerm: String!) {
    searchSeriesQuery(searchTerm: $searchTerm) {
      title
      year
    }
  }
`;

export const SEARCH_MOVIE_TITLES_QUERY = gql`
  query searchMoviesQuery($searchTerm: String!) {
    searchMoviesQuery(searchTerm: $searchTerm) {
      title
      year
    }
  }
`;
