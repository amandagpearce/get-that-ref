import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

export default function ImageMasonry({ itemData }) {
  return (
    <Box>
      <Masonry columns={7} spacing={2}>
        {itemData.map((item, index) => (
          <div key={index} data-series-year={item.year}>
            <div className="image-container">
              <img
                src={`${item.imageUrl}?w=690&auto=format`}
                srcSet={`${item.imageUrl}?w=690&auto=format&dpr=2 2x`}
                alt={item.title}
                loading="lazy"
                style={{
                  display: 'block',
                  width: '100%',
                }}
              />
            </div>
            <div className="refereces-container"></div>
          </div>
        ))}
      </Masonry>
    </Box>
  );
}
