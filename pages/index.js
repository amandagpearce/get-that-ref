import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to My Next.js App with Material UI
      </Typography>
      <Typography variant="body1" paragraph>
        This is the homepage of my application.
      </Typography>
      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </Container>
  );
};

export default HomePage;
