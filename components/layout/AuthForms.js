import React, { useContext, useState } from 'react';

import LoginForm from '../ui/forms/LoginForm';
import SignupForm from '../ui/forms/SignupForm';
import { useHttpClient } from '../../hooks/http-hook';
import AuthContext from '../../context/auth-context';
import LoadingSpinner from '../ui/LoadingSpinner';

import { Button, Grid } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

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
    }

    try {
      const responseData = await sendRequest(
        `http://localhost:5000/${endpoint}`,
        'POST',
        requestData,
        { 'Content-Type': 'application/json' } // without this the backend does not know what type of data they are receiving
      );

      if (responseData.userType) {
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

      {isLoading && <LoadingSpinner />}

      {!isLoading && requestSuccessful && <LoadingSpinner />}
    </Grid>
  );
};

export default AuthForms;
