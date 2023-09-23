import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';

import styles from './ImageMasonry.module.css';
import ReferencesList from '../references/ReferencesList';
import {
  GET_SERIES_ARTWORKS,
  GET_MOVIE_ARTWORKS,
} from '../../util/graphql_queries';

import Masonry from '@mui/lab/Masonry';
import { Grid, Box } from '@mui/material';

const ImageMasonry = ({ itemData }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProductionId, setSelectedProductionId] = useState(null);
  const [productionType, setProductionType] = useState();
  const [activeImages, setActiveImages] = useState([]);
  const [references, setReferences] = useState([]);

  // sorts productions alphabetically
  const sortedItemData = [...itemData].sort((a, b) =>
    a.productionTitle.localeCompare(b.productionTitle)
  );

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

  // updates artworks when data changes
  useEffect(() => {
    if (data) {
      const fetchedRefs =
        productionType === 'series' ? data.seriesScenes : data.movieScenes;

      console.log('Fetched Refs:', fetchedRefs);

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
    const clickedProductionType = item.productionType;
    setProductionType(clickedProductionType);
    toggleImageActive(item.id);

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
              !!references.length && ( // Check if the selectedImage matches the current item
                <div className={styles['references-container']}>
                  <Grid item xs={12}>
                    <ReferencesList references={references} />
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
