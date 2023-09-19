import React, { useContext } from 'react';
import LoginForm from '../components/ui/LoginForm';
import SignupForm from '../components/ui/SignupForm';
import { Grid } from '@mui/material';

import { useHttpClient } from '../hooks/http-hook';
import AuthContext from '../context/auth-context';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const authContext = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const router = useRouter();

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

        router.push('/admin-account');
      } else {
        authContext.login(responseData.access_token);

        if (data.login) {
          router.push('/send-a-reference');
        }
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  return (
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
        <LoginForm onSubmit={authSubmitHandler} />
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
        <SignupForm onSubmit={authSubmitHandler} />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
