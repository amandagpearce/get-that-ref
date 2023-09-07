import React from 'react';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import styles from './ImageMasonry.module.css'; // Import the CSS module

const ImageMasonry = ({ itemData }) => {
  return (
    <Box>
      <Masonry columns={6} spacing={3}>
        {itemData.map((item, index) => (
          <div
            key={index}
            data-series-year={item.year}
            className={styles['image-container']}
          >
            <img
              src={`${item.imageUrl}?w=690&auto=format`}
              srcSet={`${item.imageUrl}?w=690&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
              className={styles['image']} // Apply the CSS class for the image
            />
            <div className="refereces-container"></div>
          </div>
        ))}
      </Masonry>
    </Box>
  );
};

export default ImageMasonry;
