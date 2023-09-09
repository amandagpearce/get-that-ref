import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import styles from './ImageMasonry.module.css';
import { useQuery, gql } from '@apollo/client';

const ImageMasonry = ({ itemData }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProductionId, setSelectedProductionId] = useState(null);
  const [productionType, setProductionType] = useState(); // Set initial value
  const [activeImages, setActiveImages] = useState([]); // Define activeImages in state
  const [artworks, setArtworks] = useState([]); // Define artworks in state

  const GET_SERIES_ARTWORKS = gql`
    query GetSeriesArtworks($productionId: Int!, $productionType: String!) {
      seriesScenes(
        productionId: $productionId
        productionType: $productionType
      ) {
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

  const GET_MOVIE_ARTWORKS = gql`
    query GetMovieArtworks($productionId: Int!, $productionType: String!) {
      movieScenes(
        productionId: $productionId
        productionType: $productionType
      ) {
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

  const { loading, error, data, refetch } =
    productionType === 'series'
      ? useQuery(GET_SERIES_ARTWORKS, {
          variables: {
            productionId: selectedProductionId,
            productionType: productionType,
          },
          skip: !selectedProductionId,
        })
      : useQuery(GET_MOVIE_ARTWORKS, {
          variables: {
            productionId: selectedProductionId,
            productionType: productionType,
          },
          skip: !selectedProductionId,
        });

  // Use useEffect to update artworks when data changes
  useEffect(() => {
    if (data) {
      const fetchedArtworks =
        productionType === 'series'
          ? data.seriesScenes && data.seriesScenes[0]?.artworks
          : data.movieScenes && data.movieScenes[0].artworks;

      console.log('Fetched Artworks:', fetchedArtworks);

      // Update the artworks state
      setArtworks(fetchedArtworks || []);
    }
  }, [data, productionType]);

  const toggleImageActive = (itemId) => {
    // Toggle the active state for the clicked image
    setActiveImages(
      (prevActiveImages) =>
        prevActiveImages.includes(itemId)
          ? prevActiveImages.filter((id) => id !== itemId) // Remove from activeImages if already active
          : [itemId] // Add to activeImages if not active
    );
  };

  const handleImageClick = (item) => {
    setSelectedImage(item);
    setSelectedProductionId(item.id);

    // Set the productionType based on the clicked image
    console.log('item.productionType', item.productionType);
    const clickedProductionType = item.productionType; // Store the productionType
    setProductionType(clickedProductionType);

    // Toggle the active state for the clicked image
    toggleImageActive(item.id);

    // Pass productionType as an argument to your function
    refetch({
      productionId: item.id,
      productionType: clickedProductionType, // Use the stored productionType
    });
  };

  return (
    <Box>
      <Masonry columns={6} spacing={3}>
        {itemData.map((item, index) => (
          <div
            key={index}
            data-series-year={item.year}
            className={`${styles['image-container']} ${
              activeImages.includes(item.id)
                ? styles['active']
                : activeImages.length === 0
                ? ''
                : styles['inactive']
            }`}
            onClick={() => handleImageClick(item)}
          >
            <img
              src={`${item.imageUrl}?w=690&auto=format`}
              srcSet={`${item.imageUrl}?w=690&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
              className={styles['image']}
            />

            {selectedImage === item && ( // Check if the selectedImage matches the current item
              <div className="references-container">
                <h3>Artworks for {selectedImage.title}</h3>
                {loading && <p>Loading artworks...</p>}
                {error && <p>Error fetching artworks: {error.message}</p>}
                {artworks && ( // Check if artworks is defined before rendering
                  <ul>
                    {artworks.map((artwork) => (
                      <li key={artwork.id}>
                        <img
                          alt={artwork.artworkTitle}
                          loading="lazy"
                          width="690"
                          height="auto"
                          src={`${artwork.imageUrl}?w=690&auto=format`}
                          srcSet={`${artwork.imageUrl}?w=690&auto=format&dpr=2 2x`}
                        />
                        <strong>Artist:</strong> {artwork.artist}
                        <strong>Title:</strong> {artwork.artworkTitle}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </Masonry>
    </Box>
  );
};

export default ImageMasonry;
