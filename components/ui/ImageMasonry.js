import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import styles from './ImageMasonry.module.css';
import { useQuery, gql } from '@apollo/client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

const ImageMasonry = ({ itemData }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProductionId, setSelectedProductionId] = useState(null);
  const [productionType, setProductionType] = useState(); // Set initial value
  const [activeImages, setActiveImages] = useState([]); // Define activeImages in state
  const [references, setReferences] = useState([]); // Define artworks in state

  const sortedItemData = [...itemData].sort((a, b) =>
    a.productionTitle.localeCompare(b.productionTitle)
  );

  const GET_SERIES_ARTWORKS = gql`
    query GetSeriesArtworks($productionId: Int!, $productionType: String!) {
      seriesScenes(
        productionId: $productionId
        productionType: $productionType
      ) {
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

  const GET_MOVIE_ARTWORKS = gql`
    query GetMovieArtworks($productionId: Int!, $productionType: String!) {
      movieScenes(
        productionId: $productionId
        productionType: $productionType
      ) {
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
      const fetchedRefs =
        productionType === 'series' ? data.seriesScenes : data.movieScenes;

      console.log('Fetched Refs:', fetchedRefs);

      // Update the artworks state
      setReferences(fetchedRefs || []);
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
        {sortedItemData.map((item, index) => (
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
          >
            <img
              src={`${item.imageUrl}?w=690&auto=format`}
              srcSet={`${item.imageUrl}?w=690&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
              onClick={() => handleImageClick(item)}
              className={styles['image']}
            />

            {selectedImage === item &&
              !loading &&
              references && ( // Check if the selectedImage matches the current item
                <div className={styles['references-container']}>
                  <Grid item xs={12}>
                    {references.map((reference, key) => {
                      const artwork = reference.artworks[0]; // Get the first artwork from the artworks array

                      return (
                        <Card
                          key={key}
                          xs={12}
                          sx={{ display: 'flex', flexWrap: 'no-wrap' }}
                        >
                          <CardMedia
                            xs={4}
                            component="img"
                            alt={reference.productionTitle}
                            height="auto"
                            style={{ maxWidth: '500px', objectFit: 'contain' }}
                            image={
                              reference.sceneImgUrl
                                ? reference.sceneImgUrl
                                : 'https://placehold.co/500x450'
                            }
                          />
                          <CardMedia
                            xs={4}
                            component="img"
                            alt={reference.productionTitle}
                            height="auto"
                            style={{ maxWidth: '500px', objectFit: 'contain' }}
                            image={
                              artwork.imageUrl
                                ? artwork.imageUrl
                                : 'https://placehold.co/500x450'
                            }
                          />
                          <CardContent xs={8} sx={{ boxShadow: 'none' }}>
                            <div
                              style={{ padding: '0 10px', marginTop: '10px' }}
                            >
                              <Typography
                                gutterBottom
                                sx={{ fontSize: '1.3em' }}
                                component="p"
                              >
                                <b>Scene Description: </b>
                                {reference.sceneDescription || 'N/A'}
                              </Typography>
                              <Typography
                                gutterBottom
                                sx={{ fontSize: '1.3em' }}
                                component="p"
                              >
                                <b>Season: </b>
                                {reference.season || 'N/A'}
                              </Typography>
                              <Typography
                                gutterBottom
                                sx={{ fontSize: '1.3em' }}
                                component="p"
                              >
                                <b>Episode: </b>
                                {reference.episode || 'N/A'}
                              </Typography>
                              <Typography
                                gutterBottom
                                sx={{ fontSize: '1.3em' }}
                                component="p"
                              >
                                <b>Artwork Title: </b>
                                {artwork.artworkTitle || 'N/A'}
                                {artwork.year ? ` (${artwork.year})` : ''}
                              </Typography>
                              <Typography
                                gutterBottom
                                sx={{ fontSize: '1.3em' }}
                                component="p"
                              >
                                <b>Artist: </b>
                                {artwork.artist || 'N/A'}
                              </Typography>
                              {artwork.size && (
                                <Typography
                                  gutterBottom
                                  sx={{ fontSize: '1.3em' }}
                                  component="p"
                                >
                                  <b>Artwork Size: </b>
                                  {artwork.size}
                                </Typography>
                              )}
                              {artwork.description && (
                                <Typography
                                  gutterBottom
                                  sx={{ fontSize: '1.3em' }}
                                  component="p"
                                >
                                  <b>Artwork Description: </b>
                                  {artwork.description}
                                </Typography>
                              )}
                              <Typography
                                gutterBottom
                                sx={{ fontSize: '1.3em' }}
                                component="p"
                              >
                                <b>Referenced in: </b>
                                {reference.productionType}{' '}
                                {reference.productionTitle} (
                                {reference.productionYear || 'N/A'})
                                {reference.episode &&
                                  reference.season &&
                                  ` - S${reference.season}E${reference.episode}`}
                              </Typography>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Grid>
                </div>
              )}
          </div>
        ))}
      </Masonry>
    </Box>
  );
};

export default ImageMasonry;
