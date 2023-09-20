import React, { useContext, useState } from 'react';
import { Button, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import LoginForm from '../ui/LoginForm';
import SignupForm from '../ui/SignupForm';

import { useHttpClient } from '../../hooks/http-hook';
import AuthContext from '../../context/auth-context';

import { useRouter } from 'next/router';

const AuthForms = ({ onSuccessfulSubmit }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [requestSuccessful, setRequestSuccessful] = useState(null);
  const authContext = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const requestSuccessHandler = () => {
    setRequestSuccessful(true);

    setTimeout(() => {
      setRequestSuccessful(null);
      onSuccessfulSubmit();
    }, 1000);
  };

  const authSubmitHandler = async (data) => {
    console.log('data', data);
    let endpoint, requestData;

    if (data.login) {
      endpoint = 'login';

      requestData = JSON.stringify({
        username: data.login.email,
        password: data.login.password,
      });
    } else if (data.signup) {
      endpoint = 'register';

      requestData = JSON.stringify({
        username: data.signup.email,
        password: data.signup.password,
      });
      console.log('requestData', requestData);
    }

    try {
      const responseData = await sendRequest(
        `http://localhost:5000/${endpoint}`,
        'POST',
        requestData,
        { 'Content-Type': 'application/json' } // without this the backend does not know what type of data they are receiving
      );

      console.log('responseData', responseData);

      if (responseData.userType) {
        console.log('userType', responseData.userType);
        authContext.login(responseData.access_token, responseData.userType);
      } else {
        authContext.login(responseData.access_token);
      }

      requestSuccessHandler();
    } catch (err) {
      console.log('error', err);
    }
  };

  const toggleFormsHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <Grid
      container
      style={{
        margin: '0',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '400px',
      }}
    >
      {isLogin && (
        <Grid
          item
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            padding: '0',
          }}
        >
          <h2
            style={{
              fontFamily: 'Staatliches',
              fontStyle: 'normal',
              letterSpacing: '1.2px',
              color: '#1f1f1f',
              marginTop: '0',
            }}
          >
            I already have an account:
          </h2>
          <LoginForm onSubmit={authSubmitHandler} />
        </Grid>
      )}

      {!isLogin && (
        <Grid
          item
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '0',
          }}
        >
          <h2
            style={{
              fontFamily: 'Staatliches',
              fontStyle: 'normal',
              letterSpacing: '1.2px',
              color: '#1f1f1f',
              marginTop: '0',
            }}
          >
            I'll create an account:
          </h2>
          <SignupForm onSubmit={authSubmitHandler} />
        </Grid>
      )}

      <Grid
        item
        sm={12}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '20px',
        }}
      >
        <Button onClick={toggleFormsHandler}>
          Switch to {isLogin ? 'Sign Up' : 'Login'}
        </Button>
      </Grid>

      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            left: '0',
            top: '0',
            position: 'absolute',
            background: 'rgba(0,0,0,0.3)',
          }}
        >
          <CircularProgress style={{ width: '4rem', height: '4rem' }} />
        </div>
      )}

      {!isLoading && requestSuccessful && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            left: '0',
            top: '0',
            position: 'absolute',
            background: 'rgba(0,0,0,0.3)',
          }}
        >
          <CheckCircleOutlineRoundedIcon
            style={{ width: '5rem', height: '5rem', color: '#1976d2' }}
          />
        </div>
      )}
    </Grid>
  );
};

export default AuthForms;
