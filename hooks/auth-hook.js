import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const useAuth = () => {
  const [token, setToken] = useState();
  const [userType, setUserType] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((token, userType, expirationDate) => {
    console.log('token auth-hook', token);

    setToken(token);

    if (userType) {
      setUserType(userType);
    } else {
      setUserType('regular');
    }

    console.log('expirationDate', expirationDate);

    const tokenExpiration = expirationDate || new Date();

    tokenExpiration.setTime(tokenExpiration.getTime() + 1000 * 60 * 60); // 1hr from current time

    setTokenExpirationDate(tokenExpiration);

    localStorage.setItem(
      'userData',
      JSON.stringify({
        token: token,
        userType: userType,
        expiration: tokenExpiration.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  }, []);

  // auto logout if token expires
  useEffect(() => {
    // will run when user logs in or logs out
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  // cheking localStorage to persist login
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));

    console.log('storedData', storedData);
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() // checking if expiration is in the future
    ) {
      console.log('entrou if');
      login(
        storedData.token,
        storedData.userType,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userType };
};

export default useAuth;
