import React from 'react';
import LoginForm from '../components/ui/LoginForm';
import SignupForm from '../components/ui/SignupForm';
import { Grid, Container } from '@mui/material';

const LoginPage = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={5}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
          }}
        >
          <LoginForm />
        </Grid>
        <Grid
          item
          md={2}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          {/* Simple separator */}
          <div
            style={{
              width: '1px',
              background: '#ccc',
              padding: '30px 0',
              height: '95%',
              boxSizing: 'border-box',
            }}
          ></div>
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          <SignupForm />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
