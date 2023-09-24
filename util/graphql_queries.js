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

/* ProductionsList component query to retrieve productions */
export const GET_SERIES_AND_MOVIES = gql`
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

/* Send a reference form query to send full reference with or without file */
export const generateSendReferenceQuery = (
  artist,
  artwork,
  year,
  isMovie,
  title,
  season,
  episode,
  sceneDescription,
  s3ImageUrl
) => `
mutation {
  createReference(
    artist: "${artist}",
    artworkTitle: "${artwork}",
    productionYear: ${parseInt(year, 10)},
    productionType: "${isMovie ? 'movie' : 'series'}",
    productionTitle: "${title}",
    ${!!season ? `season: ${parseInt(season, 10)},` : ''}
    ${!!episode ? `episode: ${parseInt(episode, 10)},` : ''}
    sceneDescription: "${sceneDescription}",
    ${!!s3ImageUrl ? `sceneImgUrl: "${s3ImageUrl}",` : ''}
  ) {
    success
    message
  }
}
`;

/* admin account query to retrieve refs */
export const GET_REFERENCES_TO_APPROVE = gql`
  query {
    references {
      id
      productionType
      productionTitle
      productionYear
      season
      episode
      artist
      artworkTitle
      artworkDescription
      artworkYear
      size
      currentLocation
      sceneDescription
      sceneImgUrl
    }
  }
`;

/* Admin account mutation query to edit reference record before approval */
export function generateEditRefMutationQuery({
  editData,
  productionType,
  escapedArtworkDescription,
  artworkYear,
  artworkTitle,
  size,
  currentLocation,
  title,
  year,
  episode,
  season,
  artist,
  sceneDescription,
}) {
  // Define the common part of the mutation query
  let mutationQuery = `
    mutation {
      createReference(
        id: ${editData},
        productionType: "${productionType}",
        artworkDescription: ${escapedArtworkDescription},
        artworkYear: ${artworkYear},
        artworkTitle: "${artworkTitle}",
        size: "${size}",
        currentLocation: "${currentLocation}",
        productionTitle: "${title}",
        productionYear: ${year},
        artist: "${artist}",
        sceneDescription: "${sceneDescription}"
      ) {
        success
        message
      }
    }
  `;

  // Conditionally add episode and season fields for series
  if (productionType === 'series') {
    mutationQuery = mutationQuery.replace(
      /(\s*)(episode:.*)(\s*)(season:.*)/,
      `$1episode: ${episode},$3season: ${season}`
    );
  }

  return mutationQuery;
}

/* Admin account mutation query to approve ref */
export function generateApproveRefMutationQuery(card) {
  let mutationQuery = `
    mutation {
      addInformation(
        productionType: "${card.productionType}",
        productionTitle: "${card.productionTitle}",
        productionYear: ${card.productionYear},
        artist: "${card.artist}",
        artworkTitle: "${card.artworkTitle}",
        artworkDescription: "${card.artworkDescription}",
        artworkYear: ${card.artworkYear},
        size: "${card.size}",
        currentLocation: "${card.currentLocation}",
        sceneDescription: "${card.sceneDescription}",
        sceneImgUrl: "${card.sceneImgUrl}"
      ) {
        success
        message
      }
    }
  `;

  // Conditionally add episode and season fields for series
  if (card.productionType === 'series') {
    mutationQuery = mutationQuery.replace(
      /(\s*)(episode:.*)(\s*)(season:.*)/,
      `$1episode: ${card.episode},$3season: ${card.season}`
    );
  }

  return mutationQuery;
}
