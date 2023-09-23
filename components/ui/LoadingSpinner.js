import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingSpinner = () => {
  return (
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
        zIndex: '9',
      }}
    >
      <CircularProgress style={{ width: '4rem', height: '4rem' }} />
    </div>
  );
};

export default LoadingSpinner;
