import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const ReferencesList = ({ references }) => {
  return references.map((reference, key) => {
    const artwork = reference.artworks[0]; // Get the first artwork from the artworks array

    return (
      <Card key={key} xs={12} sx={{ display: 'flex', flexWrap: 'no-wrap' }}>
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
            artwork.imageUrl ? artwork.imageUrl : 'https://placehold.co/500x450'
          }
        />
        <CardContent xs={8} sx={{ boxShadow: 'none' }}>
          <div style={{ padding: '0 10px', marginTop: '10px' }}>
            <Typography gutterBottom sx={{ fontSize: '1.3em' }} component="p">
              <b>Scene Description: </b>
              {reference.sceneDescription || 'N/A'}
            </Typography>
            <Typography gutterBottom sx={{ fontSize: '1.3em' }} component="p">
              <b>Season: </b>
              {reference.season || 'N/A'}
            </Typography>
            <Typography gutterBottom sx={{ fontSize: '1.3em' }} component="p">
              <b>Episode: </b>
              {reference.episode || 'N/A'}
            </Typography>
            <Typography gutterBottom sx={{ fontSize: '1.3em' }} component="p">
              <b>Artwork Title: </b>
              {artwork.artworkTitle || 'N/A'}
              {artwork.year ? ` (${artwork.year})` : ''}
            </Typography>
            <Typography gutterBottom sx={{ fontSize: '1.3em' }} component="p">
              <b>Artist: </b>
              {artwork.artist || 'N/A'}
            </Typography>
            {artwork.size && (
              <Typography gutterBottom sx={{ fontSize: '1.3em' }} component="p">
                <b>Artwork Size: </b>
                {artwork.size}
              </Typography>
            )}
            {artwork.description && (
              <Typography gutterBottom sx={{ fontSize: '1.3em' }} component="p">
                <b>Artwork Description: </b>
                {artwork.description}
              </Typography>
            )}
            <Typography gutterBottom sx={{ fontSize: '1.3em' }} component="p">
              <b>Referenced in: </b>
              {reference.productionType} {reference.productionTitle} (
              {reference.productionYear || 'N/A'})
              {reference.episode &&
                reference.season &&
                ` - S${reference.season}E${reference.episode}`}
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  });
};

export default ReferencesList;
